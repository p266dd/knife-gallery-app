import UserForm from "@/ui/admin/user-form";
import { fetchSingleUser } from "@/actions/fetch-users";
import BackButton from "@/ui/back-button";

export default async function SingleUserPage({ params }) {
  const { userId } = await params;

  const user = await fetchSingleUser({ userId });

  return (
    <main className="py-9 px-3">
      <div className="mb-5">
        <BackButton />
      </div>
      <div className="mb-9">
        <span className="text-sm text-slate-500">Editing</span>
        <h1 className="text-2xl font-semibold text-slate-700">{user.name}</h1>
      </div>

      <div className="mb-9">
        <UserForm user={user} edit={true} />
      </div>
    </main>
  );
}
