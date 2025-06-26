import { getPemasukan, getLoggedInUser } from "@/lib/data";
import { PemasukanClientPage } from "./pemasukan-client-page";

export default async function PemasukanPage() {
  const pemasukanList = await getPemasukan();
  const loggedInUser = await getLoggedInUser();

  return <PemasukanClientPage initialPemasukan={pemasukanList} loggedInUser={loggedInUser} />;
}
