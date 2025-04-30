import { ShoppingBag } from "lucide-react";
import prisma from "@/data/prisma";
import { getSession } from "@/utils/session";
import { fetchCart } from "@/actions/fetch-cart";
import CartProduct from "@/ui/cart-product";
import EmptyCart from "@/ui/empty-cart";

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
    engraving: user.engraving ? JSON.stringify(user.engraving) : [],
    id: user.id,
  };

  return (
    <main className="pt-16 pb-40">
      <div className="px-6 mt-9 mb-12">
        <h1 className="text-4xl mb-2">Shopping Cart</h1>
        {cart && (
          <p className="text-sm text-slate-400">
            You have {cart.cartCount} {cart.cartCount == 1 ? "item" : "items"}{" "}
            in your cart.
          </p>
        )}
      </div>

      <div className="px-6">
        {cart && cart.cartCount !== 0 ? (
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

        {cart && cart.cartCount !== 0 && (
          <div className="my-4 flex flex-col gap-2">
            <button className="flex items-center justify-center gap-3 w-full px-4 py-2 bg-slate-800 text-white font-bold rounded-xl">
              <ShoppingBag size={18} />
              <span>Order Now</span>
            </button>

            <button className="w-full px-4 py-2 bg-slate-200 text-slate-600 text-center text-sm rounded-xl">
              <span>Clear Cart</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
