import { getLoggedInUser } from "@/lib/data";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const loggedInUser = await getLoggedInUser();

  return (
    <div className="grid gap-6">
       <ProfileClient user={loggedInUser} />
    </div>
  );
}
