import { getLoggedInUser } from "@/lib/data";
import { DashboardClient } from "./dashboard-client";
import type { User } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    redirect('/');
  }

  return (
    <DashboardClient user={loggedInUser}>
      {children}
    </DashboardClient>
  );
}
