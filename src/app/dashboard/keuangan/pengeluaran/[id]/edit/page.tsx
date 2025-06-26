import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPengeluaranById, getLoggedInUser } from '@/lib/data';
import { updatePengeluaran } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default async function EditPengeluaranPage({ params }: { params: { id: string } }) {
  const loggedInUser = await getLoggedInUser();
  if (loggedInUser.role !== 'admin' && loggedInUser.role !== 'bendahara') {
    notFound();
  }
  
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }

  const pengeluaran = await getPengeluaranById(id);

  if (!pengeluaran) {
    notFound();
  }

  const updatePengeluaranWithId = updatePengeluaran.bind(null, pengeluaran.id);

  return (
    <div className="grid gap-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/keuangan/pengeluaran/${pengeluaran.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Kembali ke Detail</span>
            </Link>
          </Button>
        <div>
            <h1 className="text-2xl font-semibold">Edit Pengeluaran</h1>
            <p className="text-muted-foreground">Perbarui informasi untuk catatan pengeluaran ini.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detail Pengeluaran</CardTitle>
          <CardDescription>Lakukan perubahan pada detail pengeluaran di bawah ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updatePengeluaranWithId} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea id="description" name="description" defaultValue={pengeluaran.description} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="amount">Jumlah (IDR)</Label>
                    <Input id="amount" name="amount" type="number" defaultValue={pengeluaran.amount} required />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="date">Tanggal</Label>
                    <Input id="date" name="date" type="date" defaultValue={new Date(pengeluaran.date).toISOString().split('T')[0]} required />
                </div>
            </div>
            
            <div className="flex justify-end gap-2">
                 <Button variant="outline" asChild>
                    <Link href={`/dashboard/keuangan/pengeluaran/${pengeluaran.id}`}>Batal</Link>
                </Button>
                <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
