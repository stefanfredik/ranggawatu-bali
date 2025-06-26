import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { ArrowLeft, Edit } from 'lucide-react';

import { getPemasukanById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function DetailPemasukanPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }

  const pemasukan = await getPemasukanById(id);

  if (!pemasukan) {
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
          <Link href="/dashboard/keuangan/pemasukan">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali ke Pemasukan</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Detail Pemasukan</h1>
          <p className="text-muted-foreground">Melihat rincian catatan pemasukan.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href={`/dashboard/keuangan/pemasukan/${pemasukan.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Rincian Pemasukan</CardTitle>
          <CardDescription>ID Transaksi: {pemasukan.id}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm text-muted-foreground">Deskripsi</div>
            <div className="col-span-2 text-sm font-medium">{pemasukan.description}</div>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm text-muted-foreground">Jumlah</div>
            <div className="col-span-2 text-sm font-medium font-mono">{formatCurrency(pemasukan.amount)}</div>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm text-muted-foreground">Tanggal</div>
            <div className="col-span-2 text-sm font-medium">{format(new Date(pemasukan.date), "PPP", { locale: localeID })}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
