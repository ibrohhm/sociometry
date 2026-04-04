import { auth } from "@clerk/nextjs/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    return Response.json({ error: error?.error ?? "Failed to update team" }, { status: res.status });
  }

  return Response.json(await res.json());
}
