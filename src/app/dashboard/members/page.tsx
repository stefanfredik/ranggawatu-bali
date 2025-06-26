import { getUsers, getLoggedInUser } from "@/lib/data";
import { MembersClientPage } from "./members-client-page";

export default async function MembersPage() {
    const userList = await getUsers();
    const loggedInUser = await getLoggedInUser();

    return <MembersClientPage initialUsers={userList} loggedInUser={loggedInUser} />;
}
