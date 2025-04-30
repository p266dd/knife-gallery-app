import { Settings } from "lucide-react";

export default async function SettingsPage() {
  return (
    <main className="py-12 pr-6 pl-4">
      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Settings size={28} strokeWidth={1.5} />
            <h1 className="text-2xl text-slate-700">Settings</h1>
          </div>
        </div>

        <div>
          <div>Brands</div>
          <div>Handles</div>
          <div>Filters</div>
        </div>
      </div>
    </main>
  );
}
