import { currentUser } from "@clerk/nextjs/server";
import { GET as getMe } from "../api/users/me/route";
import { GET as getTeams } from "../api/teams/route";
import AdminHeader from "../components/AdminHeader";
import TeamList from "../components/TeamList";
import type { Team } from "../types/team";

export default async function AdminPage() {
  const user = await currentUser();

  const meRes = await getMe();
  const meData = await meRes.json();

  const teamsRes = await getTeams(meData.id);
  const teamsData: Team[] = await teamsRes.json();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <AdminHeader
        fullName={user?.fullName ?? null}
        email={user?.emailAddresses[0]?.emailAddress ?? null}
      />

      <main className="flex flex-col items-center gap-6 p-8 w-full">
        <TeamList initialTeams={teamsData} facilitatorId={meData.id} />
      </main>
    </div>
  );
}
