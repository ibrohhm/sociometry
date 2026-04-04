import { auth } from "@clerk/nextjs/server";
import { Nomination } from "@/app/types/nomination";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/teams/${encodeURIComponent(id)}/nominations`
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    return Response.json(
      { error: error?.error ?? "Failed to fetch nominations" },
      { status: res.status }
    );
  }

  const data: Nomination[] = await res.json();
  return Response.json(data);
}
