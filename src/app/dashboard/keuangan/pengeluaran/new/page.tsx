import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPengeluaran } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";

export default function NewPengeluaranPage() {

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
            <h1 className="text-2xl font-semibold">Tambah Pengeluaran Baru</h1>
            <p className="text-muted-foreground">Isi detail untuk mencatat pengeluaran baru.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detail Pengeluaran</CardTitle>
          <CardDescription>Mohon berikan informasi yang diperlukan untuk pengeluaran baru.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPengeluaran} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea id="description" name="description" placeholder="e.g., Biaya konsumsi rapat" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="amount">Jumlah (IDR)</Label>
                    <Input id="amount" name="amount" type="number" placeholder="e.g., 150000" required />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="date">Tanggal</Label>
                    <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                </div>
            </div>
            
            <div className="flex justify-end gap-2">
                 <Button variant="outline" asChild>
                    <Link href="/dashboard/keuangan/pengeluaran">Batal</Link>
                </Button>
                <Button type="submit">Simpan Pengeluaran</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
