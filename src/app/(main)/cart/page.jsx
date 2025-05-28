import prisma from "@/data/prisma";
import { getSession } from "@/utils/session";
import { fetchCart } from "@/actions/fetch-cart";
import CartProductList from "@/ui/cart-product-list";

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

      <CartProductList cart={cart} userPreferences={userPreferences} />
    </main>
  );
}
