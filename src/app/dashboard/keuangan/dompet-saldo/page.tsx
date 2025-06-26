import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFinancialSummary } from "@/lib/data";
import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default async function DompetSaldoPage() {
  const summary = await getFinancialSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dompet Saldo</h1>
        <p className="text-muted-foreground">
          Ringkasan kondisi keuangan organisasi Anda saat ini.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Saldo
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.saldoAkhir)}</div>
            <p className="text-xs text-muted-foreground">
              Saldo kas organisasi saat ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pemasukan
            </CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalPemasukan)}</div>
             <div className="text-xs text-muted-foreground mt-2 space-y-1">
                <div className="flex justify-between">
                    <span>Uang Pangkal</span>
                    <span>{formatCurrency(summary.totalUangPangkal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Pemasukan Lain</span>
                    <span>{formatCurrency(summary.totalPemasukanLain)}</span>
                </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalPengeluaran)}</div>
            <p className="text-xs text-muted-foreground">
              Akumulasi dari semua biaya operasional
            </p>
          </CardContent>
        </Card>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Halaman untuk melihat riwayat transaksi akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
