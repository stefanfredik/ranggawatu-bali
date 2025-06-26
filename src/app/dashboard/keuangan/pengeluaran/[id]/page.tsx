import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { ArrowLeft, Edit } from 'lucide-react';

import { getPengeluaranById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function DetailPengeluaranPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }

  const pengeluaran = await getPengeluaranById(id);

  if (!pengeluaran) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/keuangan/pengeluaran">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali ke Pengeluaran</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Detail Pengeluaran</h1>
          <p className="text-muted-foreground">Melihat rincian catatan pengeluaran.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href={`/dashboard/keuangan/pengeluaran/${pengeluaran.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Rincian Pengeluaran</CardTitle>
          <CardDescription>ID Transaksi: {pengeluaran.id}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm text-muted-foreground">Deskripsi</div>
            <div className="col-span-2 text-sm font-medium">{pengeluaran.description}</div>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm text-muted-foreground">Jumlah</div>
            <div className="col-span-2 text-sm font-medium font-mono">{formatCurrency(pengeluaran.amount)}</div>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm text-muted-foreground">Tanggal</div>
            <div className="col-span-2 text-sm font-medium">{format(new Date(pengeluaran.date), "PPP", { locale: localeID })}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
