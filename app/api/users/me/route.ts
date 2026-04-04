import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.emailAddresses[0]?.emailAddress;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users?email=${encodeURIComponent(email)}`
  );

  if (!res.ok) {
    return Response.json({ error: "User not found" }, { status: res.status });
  }

  return Response.json(await res.json());
}
