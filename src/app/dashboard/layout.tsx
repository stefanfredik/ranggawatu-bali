import { getLoggedInUser } from "@/lib/data";
import { DashboardClient } from "./dashboard-client";
import type { User } from "@/lib/data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedInUser = await getLoggedInUser();

  return (
    <DashboardClient user={loggedInUser}>
      {children}
    </DashboardClient>
  );
}
