import { auth } from "@clerk/nextjs/server";
import type { CreateTeamPayload } from "../../types/team";

export async function GET(facilitatorId: string) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!facilitatorId) {
    return Response.json({ error: "facilitator_id is required" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/teams?facilitator_id=${encodeURIComponent(facilitatorId)}`
  );

  if (!res.ok) {
    return Response.json({ error: "Failed to fetch teams" }, { status: res.status });
  }

  return Response.json(await res.json());
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: CreateTeamPayload = await request.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return Response.json({ error: "Failed to create team" }, { status: res.status });
  }

  return Response.json(await res.json(), { status: 201 });
}
