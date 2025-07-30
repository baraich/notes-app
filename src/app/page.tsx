import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="w-full h-screen grid place-items-center">
      {session?.user.email}
    </div>
  );
}
