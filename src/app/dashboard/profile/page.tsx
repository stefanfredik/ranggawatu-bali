import { getLoggedInUser } from "@/lib/data";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    // The layout should handle the redirect, but this is a safeguard.
    return null;
  }

  return (
    <div className="grid gap-6">
       <ProfileClient user={loggedInUser} />
    </div>
  );
}
