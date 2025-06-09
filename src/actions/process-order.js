"use server";
import prisma from "@/data/prisma";
import { verifyUserSession } from "@/utils/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ClientNewOrderEmail } from "@/emails/client-new-order";
import { StaffNewOrderEmail } from "@/emails/staff-new-order";

export default async function processOrder() {
  // Get the user's id stored in the session cookie.
  const session = await verifyUserSession();

  try {
    // 1. Fetch the current cart's information
    const cart = await prisma.cart.findUnique({
      where: { clientId: session.id },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sizes: true,
              },
            },
          },
        },
      },
    });

    if (!cart || !cart.products || cart.products.length === 0) {
      // If cart is empty, redirect back to cart page with a message
      return redirect("/cart?error");
    }

    const orderProductCreateInputs = [];
    let totalOrderPrice = 0;
    const stockUpdateOperations = [];

    // 2. Loop through products, parse details, validate stock, and prepare order data
    for (const cartProduct of cart.products) {
      if (!cartProduct.product || !cartProduct.product.sizes) {
        console.log(
          `Product data or sizes missing for cartProduct ID: ${cartProduct.id}`
        );
      }

      // 3. Each product has a details field that needs to be parsed
      const parsedDetails = JSON.parse(cartProduct.details); // Expected: [{ id: sizeId, quantity: "val" }]
      const validItemsForThisOrderProduct = [];

      // 4. Loop through the details and perform a stock check against the Size model
      for (const itemDetail of parsedDetails) {
        const sizeId = itemDetail.id;
        const requestedQuantity = Number(itemDetail.quantity);

        if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
          continue; // Skip items with no valid quantity
        }

        const sizeInfo = cartProduct.product.sizes.find((s) => s.id === Number(sizeId));

        if (!sizeInfo) {
          return redirect("/cart?error");
        }

        if (requestedQuantity > sizeInfo.stock) {
          return redirect("/cart?error");
        }

        // Accumulate total price
        totalOrderPrice += sizeInfo.price * requestedQuantity;

        // Prepare for stock update
        stockUpdateOperations.push({
          sizeId: sizeInfo.id,
          decrementAmount: requestedQuantity,
          productId: cartProduct.productId, // For revalidation
        });

        // Add to items for this specific OrderProduct, storing price at time of order
        validItemsForThisOrderProduct.push({
          id: sizeId, // Size ID
          quantity: requestedQuantity,
          priceAtOrder: sizeInfo.price, // Store price at the time of order
          nameAtOrder: sizeInfo.name || String(sizeInfo.size), // Store size name/identifier
        });
      }

      if (validItemsForThisOrderProduct.length > 0) {
        orderProductCreateInputs.push({
          product: { connect: { id: cartProduct.productId } },
          brand: cartProduct.brand,
          handle: cartProduct.handle,
          request: cartProduct.request,
          details: JSON.stringify(validItemsForThisOrderProduct), // Store validated details including priceAtOrder
        });
      }
    }

    if (orderProductCreateInputs.length === 0) {
      return redirect("/cart?error");
    }

    // Generate a simple order code
    const orderCode = `ORD-${Date.now().toString(36).toUpperCase()}-${session.id.substring(0, 6).toUpperCase()}`;

    // 5. Create order in DB using Prisma transaction for atomicity
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create the Order and related OrderProduct entries
      const createdOrder = await tx.order.create({
        data: {
          client: { connect: { id: session.id } },
          code: orderCode,
          // total: totalOrderPrice,
          // status: "PENDING",
          orderProduct: {
            create: orderProductCreateInputs,
          },
        },
        include: {
          client: true,
          orderProduct: {
            include: {
              product: {
                include: {
                  sizes: true,
                },
              },
            },
          },
        },
        // select: { id: true }, // Select only the ID for the redirect URL
      });

      // Update stock for each size
      for (const op of stockUpdateOperations) {
        await tx.size.update({
          where: { id: op.sizeId },
          data: { stock: { decrement: op.decrementAmount } },
        });
      }

      // Send email to client and staff.
      try {
        ClientNewOrderEmail({
          name: session.name,
          email: session.email,
          orderDetails: createdOrder, // Order Details
        });

        StaffNewOrderEmail({
          name: session.name,
          orderDetails: createdOrder, // Order Details
        });
      } catch (err) {
        console.log(err);
      }

      // Clear the user's cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          products: {
            deleteMany: {}, // Deletes all CartProduct records linked to this cart
          },
        },
      });

      return createdOrder;
    });

    // Revalidate paths for updated data
    revalidatePath("/cart", "page");
    revalidatePath("/account/orders", "page"); // Assuming a user-specific orders page
    revalidatePath(`/account/orders/${newOrder.id}`, "page"); // Specific order page

    const uniqueProductIds = [
      ...new Set(stockUpdateOperations.map((op) => op.productId)),
    ];
    for (const productId of uniqueProductIds) {
      revalidatePath(`/products/${productId}`, "page"); // Revalidate product pages due to stock changes
    }
    revalidatePath("/", "page"); // Revalidate homepage if it shows product stock/listings

    // Redirect to an order success page or the user's order history
    return redirect("/orders?successfullOrder=true");
  } catch (error) {
    console.log("Failed to process order:", error);
    // Redirect back to cart with an error message
    // Ensure the error message is URL-encoded to be safe.
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return console.log("/cart?error=" + errorMessage);
  }
}
