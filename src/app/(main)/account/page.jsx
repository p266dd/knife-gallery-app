import Link from "next/link";
import { ReceiptJapaneseYen } from "lucide-react";
import prisma from "@/data/prisma";
import { getSession } from "@/utils/session";

import AccountForm from "@/ui/account-form";

export default async function AccountPage() {
  const session = await getSession();

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
    omit: {
      password: true,
      role: true,
      token: true,
      code: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <main className="pt-16 pb-40">
      <div className="px-6 mt-9 mb-7 flex justify-between items-center">
        <h1 className="text-4xl">Account</h1>
        <Link
          href="/orders"
          className="flex items-center px-4 py-2 sm:py-3 bg-slate-700 text-white text-sm sm:text-base font-bold rounded-xl"
        >
          <ReceiptJapaneseYen size={18} className="inline-block mr-2" />
          Order History
        </Link>
      </div>

      <div className="mt-6 sm:mt-16 px-6">
        <AccountForm user={user} />
      </div>
    </main>
  );
}
