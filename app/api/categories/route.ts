import categories from "./data.json";

export async function GET() {
  return Response.json(categories);
}
