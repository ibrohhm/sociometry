import teams from "./data.json";

export async function GET() {
  return Response.json(teams);
}
