import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function getAuth() {
  const session = await getServerSession(authOptions);
  return { userId: session?.user?.id || null };
}

