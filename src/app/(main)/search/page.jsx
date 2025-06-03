import SearchForm from "@/ui/search-form";
import { verifyUserSession } from "@/utils/session";
import prisma from "@/data/prisma";

export default async function SearchPage() {
  await verifyUserSession();

  const brands = await prisma.brand.findMany({
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
    <main className="pt-16 pb-48">
      <div className="px-6 mt-9 mb-7">
        <h1 className="text-4xl mb-2">Search</h1>
      </div>

      <div className="px-6 mt-6">
        <SearchForm brands={brands} materials={materials} />
      </div>
    </main>
  );
}
