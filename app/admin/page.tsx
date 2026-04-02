import { currentUser } from "@clerk/nextjs/server";
import AdminHeader from "../components/AdminHeader";

export default async function AdminPage() {
  const user = await currentUser();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <AdminHeader
        fullName={user?.fullName ?? null}
        email={user?.emailAddresses[0]?.emailAddress ?? null}
      />

      <main className="flex flex-col items-center gap-6 p-8">
        <p className="text-white/80">Create and manage your surveys here.</p>
      </main>
    </div>
  );
}
