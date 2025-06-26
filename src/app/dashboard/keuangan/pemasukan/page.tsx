import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPemasukan } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeID } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function PemasukanPage() {
  const pemasukanList = await getPemasukan();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-6">
       <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-semibold">Pemasukan</h1>
            <p className="text-muted-foreground">
              Kelola data pemasukan organisasi.
            </p>
        </div>
        <Button asChild>
            <Link href="/dashboard/keuangan/pemasukan/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Pemasukan
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Data Pemasukan</CardTitle>
          <CardDescription>
            Berikut adalah daftar semua pemasukan yang tercatat.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pemasukanList.length > 0 ? pemasukanList.map((pemasukan) => (
                <TableRow key={pemasukan.id}>
                  <TableCell className="font-medium">{pemasukan.description}</TableCell>
                  <TableCell>{format(new Date(pemasukan.date), "PPP", { locale: localeID })}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(pemasukan.amount)}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center">
                        Belum ada data pemasukan.
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
