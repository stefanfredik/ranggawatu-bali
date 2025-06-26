import { getUsersWithUangPangkalStatus } from "@/lib/data";
import { UangPangkalClientPage } from "./uang-pangkal-client";

export default async function UangPangkalPage() {
  const members = await getUsersWithUangPangkalStatus();

  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-2xl font-semibold">Uang Pangkal</h1>
        <p className="text-muted-foreground">
          Kelola dan lihat status pembayaran uang pangkal anggota.
        </p>
      </div>
      <UangPangkalClientPage members={members} />
    </div>
  );
}
