import { verifyUserSession } from "@/utils/session";

export default async function MainLayout({ children }) {
  await verifyUserSession();

  return <div>{children}</div>;
}
