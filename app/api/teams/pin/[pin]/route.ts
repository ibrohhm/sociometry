import type { Team } from "../../../../types/team";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  const { pin } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/teams/pin/${encodeURIComponent(pin)}`
  );

  if (!res.ok) {
    return Response.json({ error: "Team not found" }, { status: res.status });
  }

  const team: Team = await res.json();
  return Response.json(team);
}
