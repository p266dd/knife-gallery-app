import UserForm from "@/ui/admin/user-form";
import BackButton from "@/ui/back-button";

export default async function AddUserPage({ params }) {
  return (
    <main className="py-9 px-3">
      <div className="mb-5">
        <BackButton />
      </div>

      <div className="mb-9">
        <h1 className="text-2xl font-semibold text-slate-700">Add New User</h1>
      </div>

      <div className="mb-9">
        <UserForm />
      </div>
    </main>
  );
}
