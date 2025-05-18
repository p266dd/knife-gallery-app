import Link from "next/link";
import { User, CirclePlus } from "lucide-react";

import UsersTable from "@/ui/admin/users-table";
import LinkLoading from "@/ui/link-loading";

export default async function UsersPage() {
  return (
    <main className="py-9 pr-6 pl-4">
      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <User size={28} strokeWidth={1.5} className="text-slate-700" />
            <h1 className="text-2xl text-slate-700">Users</h1>
          </div>
          <Link
            className="flex items-center gap-2 px-3 py-2 text-white text-sm bg-slate-800 rounded-xl"
            href="/dashboard/users/add"
          >
            <CirclePlus size={16} />
            <span>User</span>
            <LinkLoading />
          </Link>
        </div>

        <div>
          <UsersTable />
        </div>
      </div>
    </main>
  );
}
