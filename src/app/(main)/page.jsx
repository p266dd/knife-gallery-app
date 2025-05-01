import Image from "next/image";

import prisma from "@/data/prisma";
import ProductsGrid from "@/ui/products-grid";
import FilterTag from "@/ui/filter-tag";
import LogoutButton from "@/ui/logout-button";

import { fnLogout } from "@/actions/logout";
import { getSession } from "@/utils/session";

export default async function HomePage() {
  const session = await getSession();

  const filters = await prisma.filter.findMany({
    orderBy: {
      name: "desc",
    },
  });

  return (
    <main className="pb-40">
      <div className="px-6 pt-8">
        <Image
          priority
          src="/img/logo.png"
          width={897}
          height={192}
          alt="Ironclad"
          className="w-52"
        />
      </div>

      <div className="px-6 mt-8 flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg mb-3">Welcome back,</h3>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <LogoutButton logout={fnLogout} />
            {session.name}
          </h1>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative px-6 mb-3">
          <span className="block absolute top-0 right-0 h-full w-10 bg-linear-270 from-white from-30% to-white/0"></span>

          <div className="w-full overflow-auto">
            <div className="flex flex-row gap-2 py-3">
              {filters.map((filter, i) => (
                <FilterTag key={i} filter={filter} />
              ))}
            </div>
          </div>
        </div>

        <ProductsGrid />
      </div>
    </main>
  );
}
