import Header from "@/ui/header";
import { verifyUserSession } from "@/utils/session";
import { fetchCart } from "@/actions/fetch-cart";

import DisplayMessage from "@/ui/display-message";

export default async function MainLayout({ children }) {
  const session = await verifyUserSession();

  const { cartCount } = await fetchCart();

  return (
    <div className="h-full max-w-5xl mx-auto">
      <DisplayMessage />
      <Header userRole={session.role} cartCount={cartCount} />
      {children}
    </div>
  );
}
