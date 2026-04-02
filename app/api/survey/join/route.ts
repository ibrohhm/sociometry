import teams from "../../teams/data.json";

export async function POST(request: Request) {
  const { pin } = await request.json();
  const team = teams.find((t) => t.pin === pin);
  if (!team) {
    return Response.json({ error: "Invalid PIN" }, { status: 404 });
  }
  return Response.json(team);
}
