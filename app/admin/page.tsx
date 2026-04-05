import { currentUser } from "@clerk/nextjs/server";
import AdminHeader from "../components/AdminHeader";
import TeamList from "../components/TeamList";
import type { Team } from "../types/team";

async function getUserData() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("No email found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users?email=${encodeURIComponent(email)}`
  );

  if (!res.ok) {
    throw new Error("User not found");
  }

  return res.json();
}

async function getTeams(facilitatorId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/teams?facilitator_id=${encodeURIComponent(facilitatorId)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch teams");
  }

  return res.json();
}

export default async function AdminPage() {
  const user = await currentUser();

  try {
    const userData = await getUserData();
    const teamsData: Team[] = await getTeams(userData.id);

    return (
      <div className="flex flex-col w-full min-h-screen">
        <AdminHeader
          fullName={user?.fullName ?? null}
          email={user?.emailAddresses[0]?.emailAddress ?? null}
        />

        <main className="flex flex-col items-center gap-6 p-8 w-full">
          <TeamList initialTeams={teamsData} facilitatorId={userData.id} />
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error instanceof Error ? error.message : 'An error occurred'}</p>
      </div>
    );
  }
}
