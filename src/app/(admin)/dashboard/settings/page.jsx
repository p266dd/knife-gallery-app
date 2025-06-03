import { Settings } from "lucide-react";
import prisma from "@/data/prisma";

import ManageBrandsForm from "@/ui/admin/manage-brands-form";
import ManageHandlesForm from "@/ui/admin/manage-handles-form";
import ManageFiltersForm from "@/ui/admin/manage-filters";
import ManageMaterialsForm from "@/ui/admin/manage-materials-form";
import ManageMessagesForm from "@/ui/admin/manage-messages-form";

export default async function SettingsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const messages = await prisma.message.findMany({
    orderBy: {
      title: "asc",
    },
  });

  const handles = await prisma.handle.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const filters = await prisma.filter.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const materials = await prisma.material.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="py-9 pr-6 pl-4">
      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Settings size={28} strokeWidth={1.5} className="text-slate-700" />
            <h1 className="text-2xl text-slate-700">Settings</h1>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <ManageMessagesForm messages={messages} />
          </div>
          <hr className="border-slate-300" />
          <div>
            <ManageBrandsForm brands={brands} />
          </div>
          <hr className="border-slate-300" />
          <div>
            <ManageHandlesForm handles={handles} />
          </div>
          <hr className="border-slate-300" />
          <div>
            <ManageMaterialsForm materials={materials} />
          </div>
          <hr className="border-slate-300" />
          <ManageFiltersForm filters={filters} />
        </div>
      </div>
    </main>
  );
}
