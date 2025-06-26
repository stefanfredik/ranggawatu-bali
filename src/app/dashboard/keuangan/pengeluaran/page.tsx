import { getPengeluaran } from "@/lib/data";
import { PengeluaranClientPage } from "./pengeluaran-client-page";

export default async function PengeluaranPage() {
  const pengeluaranList = await getPengeluaran();

  return <PengeluaranClientPage initialPengeluaran={pengeluaranList} />;
}
