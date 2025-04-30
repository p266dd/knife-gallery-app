import { Settings } from "lucide-react";
import prisma from "@/data/prisma";

import ManageBrandsForm from "@/ui/admin/manage-brands-form";
import ManageHandlesForm from "@/ui/admin/manage-handles-form";

export default async function SettingsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const handles = await prisma.handle.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="py-12 pr-6 pl-4">
      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Settings size={28} strokeWidth={1.5} />
            <h1 className="text-2xl text-slate-700">Settings</h1>
          </div>
        </div>

        <div className="flex flex-col gap-8 pt-6">
          <div>
            <ManageBrandsForm brands={brands} />
          </div>

          <div>
            <ManageHandlesForm handles={handles} />
          </div>

          <div>Filters</div>
        </div>
      </div>
    </main>
  );
}
