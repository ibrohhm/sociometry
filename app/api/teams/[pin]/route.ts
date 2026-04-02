import teams from "../data.json";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  const { pin } = await params;
  const team = teams.find((t) => t.pin === pin);
  if (!team) {
    return Response.json({ error: "Team not found" }, { status: 404 });
  }
  return Response.json(team);
}
