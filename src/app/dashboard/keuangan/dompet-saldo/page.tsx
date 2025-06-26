import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFinancialSummary, getRecentTransactions } from "@/lib/data";
import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as localeID } from 'date-fns/locale';

export default async function DompetSaldoPage() {
  const summary = await getFinancialSummary();
  const recentTransactions = await getRecentTransactions();

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
                    <span>Iuran Bulanan</span>
                    <span>{formatCurrency(summary.totalIuranBulanan)}</span>
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
          <CardTitle>Riwayat Transaksi Terakhir</CardTitle>
          <CardDescription>
            Menampilkan transaksi dari 30 hari terakhir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.length > 0 ? recentTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.description}</TableCell>
                  <TableCell>
                    <Badge variant={tx.type === 'pemasukan' ? 'secondary' : 'destructive'}>
                      {tx.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{format(new Date(tx.date), "PPP", { locale: localeID })}</TableCell>
                  <TableCell className={`text-right font-mono ${tx.type === 'pengeluaran' ? 'text-destructive' : ''}`}>
                    {tx.type === 'pemasukan' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Tidak ada transaksi dalam 30 hari terakhir.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
