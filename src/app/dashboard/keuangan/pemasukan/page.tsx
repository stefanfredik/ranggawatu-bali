import { getPemasukan } from "@/lib/data";
import { PemasukanClientPage } from "./pemasukan-client-page";

export default async function PemasukanPage() {
  const pemasukanList = await getPemasukan();

  return <PemasukanClientPage initialPemasukan={pemasukanList} />;
}
