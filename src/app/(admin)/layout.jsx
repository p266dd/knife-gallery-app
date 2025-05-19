import { getSession } from "@/utils/session";
import { redirect } from "next/navigation";

import DashboardNavigation from "@/ui/admin/navigation";

export default async function AdminLayout({ children }) {
  const session = await getSession();

  // * Redirect user back to previous page if not admin.
  if (!session || session.role !== "admin") {
    return redirect("/", "replace");
  }

  return (
    <div>
      <DashboardNavigation />
      <div className="ml-12  sm:max-w-5xl sm:mx-auto">{children}</div>
    </div>
  );
}
