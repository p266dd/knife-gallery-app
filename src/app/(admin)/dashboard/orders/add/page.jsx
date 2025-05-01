import BackButton from "@/ui/back-button";

export default async function NewOrderPage() {
  return (
    <main className="py-9 px-3">
      <div className="mb-5">
        <BackButton />
      </div>

      <div className="mb-9">
        <h1 className="text-2xl font-semibold text-slate-700">Create Order</h1>
      </div>

      <div className="mb-9"></div>
    </main>
  );
}
