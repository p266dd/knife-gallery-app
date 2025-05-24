import prisma from "@/data/prisma";
import { getSession } from "@/utils/session";
import { fetchCart } from "@/actions/fetch-cart";
import ClearCartButton from "@/ui/clear-cart-button";
import CartProduct from "@/ui/cart-product";
import EmptyCart from "@/ui/empty-cart";
import OrderNowButton from "@/ui/order-now-button";

export default async function CartPage() {
  const cart = await fetchCart();
  const session = await getSession();

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      engraving: true,
      id: true,
    },
  });

  const userPreferences = {
    engraving: user?.engraving ? JSON.parse(user.engraving) : [],
    id: user?.id,
  };

  const processOrder = async () => {
    "use server";
    console.log("Processing order...");
    return true;
  };

  return (
    <main className="pt-16 pb-40">
      <div className="px-6 mt-9 mb-12">
        <h1 className="text-4xl mb-2">Shopping Cart</h1>
        {cart && (
          <p className="text-sm text-slate-400">
            You have {cart.cartCount} {cart.cartCount == 1 ? "item " : "items "}
            in your cart.
          </p>
        )}
      </div>

      <div className="px-6 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={`flex-grow ${cart?.cartCount !== 0 ? "sm:w-3/4" : ""} `}
        >
          {cart && cart?.cartCount !== 0 ? (
            cart.data.products.map((product, i) => (
              <CartProduct
                key={i}
                cartProduct={product}
                preferences={userPreferences}
              />
            ))
          ) : (
            <EmptyCart />
          )}
        </div>

        {cart && cart?.cartCount !== 0 && (
          <div className="flex-grow sm:w-1/4">
            <div className="my-4 flex flex-col gap-2">
              <OrderNowButton processOrder={processOrder} />

              <ClearCartButton />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
