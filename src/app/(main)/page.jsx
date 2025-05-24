import Image from "next/image";
import { string } from "yup";

import ProductsGrid from "@/ui/products-grid";
import FilterTag from "@/ui/filter-tag";
import LogoutButton from "@/ui/logout-button";

import { fetchFilters } from "@/actions/filters";
import { fnLogout } from "@/actions/logout";
import { getSession } from "@/utils/session";

export default async function HomePage({ searchParams }) {
  const session = await getSession();

  let { filter } = await searchParams;

  // * Clean filter.
  const sanitizedFilter = await string()
    .default("")
    .lowercase()
    .trim()
    .validate(filter);

  const filters = await fetchFilters();

  return (
    <main className="pb-44 sm:pb-56">
      <div className="px-6 pt-8 mb-8 sm:mb-12">
        <Image
          priority
          src="/img/logo.png"
          width={897}
          height={192}
          alt="Ironclad"
          className="w-52 sm:w-64"
        />
      </div>

      <div className="px-6 mb-6 flex flex-row items-center justify-between sm:mb-12">
        <div>
          <h3 className="text-lg mb-3 sm:text-2xl sm:mb-9">Welcome back,</h3>
          <h1 className="text-2xl font-bold flex items-center gap-3 sm:text-4xl">
            <LogoutButton logout={fnLogout} />
            {session?.name}
          </h1>
        </div>
      </div>

      <div>
        {filters.length > 0 && (
          <div className="relative px-6 mb-3">
            <div className="w-full overflow-auto">
              <div className="flex flex-row gap-2 py-3">
                {filters.map((filter, i) => (
                  <FilterTag key={i} filter={filter} active={sanitizedFilter} />
                ))}
              </div>
            </div>
          </div>
        )}

        <ProductsGrid filter={sanitizedFilter} />
      </div>
    </main>
  );
}
