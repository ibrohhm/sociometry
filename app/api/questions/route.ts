export async function GET() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions`);

  if (!res.ok) {
    return Response.json({ error: "Failed to fetch questions" }, { status: res.status });
  }

  return Response.json(await res.json());
}
