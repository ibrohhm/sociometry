export async function POST(request: Request) {
  const { pin } = await request.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/teams/${encodeURIComponent(pin)}`
  );

  if (!res.ok) {
    return Response.json({ error: "Invalid PIN" }, { status: 404 });
  }

  return Response.json(await res.json());
}
