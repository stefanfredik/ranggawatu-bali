import { IuranBulananClientPage } from "./iuran-bulanan-client";
import { getUsersWithIuranStatus, IURAN_BULANAN_AMOUNT, getLoggedInUser } from "@/lib/data";

export default async function IuranBulananPage({
  searchParams,
}: {
  searchParams?: {
    month?: string;
    year?: string;
  };
}) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const month = Number(searchParams?.month) || currentMonth;
  const year = Number(searchParams?.year) || currentYear;
  
  const members = await getUsersWithIuranStatus(month, year);
  const loggedInUser = await getLoggedInUser();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Iuran Bulanan</h1>
        <p className="text-muted-foreground">
          Kelola dan lihat status pembayaran iuran bulanan anggota.
        </p>
      </div>
      <IuranBulananClientPage
        members={members}
        initialMonth={month}
        initialYear={year}
        iuranAmount={IURAN_BULANAN_AMOUNT}
        loggedInUser={loggedInUser}
      />
    </div>
  );
}
