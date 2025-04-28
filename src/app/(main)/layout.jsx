import Header from "@/ui/header";
import { verifyUserSession } from "@/utils/session";
import { fetchCart } from "@/actions/fetch-cart";

export default async function MainLayout({ children }) {
  const session = await verifyUserSession();

  const { cartCount } = await fetchCart();

  return (
    <div className="h-screen pb-48">
      <Header userRole={session.role} cartCount={cartCount} />
      {children}
    </div>
  );
}
