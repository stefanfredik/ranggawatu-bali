import { getPengeluaran, getLoggedInUser } from "@/lib/data";
import { PengeluaranClientPage } from "./pengeluaran-client-page";

export default async function PengeluaranPage() {
  const pengeluaranList = await getPengeluaran();
  const loggedInUser = await getLoggedInUser();

  return <PengeluaranClientPage initialPengeluaran={pengeluaranList} loggedInUser={loggedInUser} />;
}
