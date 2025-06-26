'use client';
import { useState, useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeID } from 'date-fns/locale';
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deletePemasukan } from '@/lib/actions';
import type { Pemasukan } from "@/lib/data";

export function PemasukanClientPage({ initialPemasukan }: { initialPemasukan: Pemasukan[] }) {
  const [pemasukanList, setPemasukanList] = useState<Pemasukan[]>(initialPemasukan);
  const [itemToDelete, setItemToDelete] = useState<Pemasukan | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const openDeleteDialog = (item: Pemasukan) => {
    setItemToDelete(item);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    startTransition(async () => {
        const result = await deletePemasukan(itemToDelete.id);
        if (result?.success) {
            setPemasukanList(currentList => currentList.filter(item => item.id !== itemToDelete.id));
            toast({
                title: "Data Dihapus",
                description: `Pemasukan "${itemToDelete.description}" telah berhasil dihapus.`,
            });
        } else {
            toast({
                title: "Error",
                description: result?.message || "Gagal menghapus data.",
                variant: "destructive",
            });
        }
        setItemToDelete(null);
    });
  };

  return (
    <>
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
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pemasukanList.length > 0 ? pemasukanList.map((pemasukan) => (
                  <TableRow key={pemasukan.id}>
                    <TableCell className="font-medium">{pemasukan.description}</TableCell>
                    <TableCell>{format(new Date(pemasukan.date), "PPP", { locale: localeID })}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(pemasukan.amount)}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Link href={`/dashboard/keuangan/pemasukan/${pemasukan.id}`}>
                            <DropdownMenuItem>
                              Lihat Detail
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/dashboard/keuangan/pemasukan/${pemasukan.id}/edit`}>
                            <DropdownMenuItem>
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onSelect={() => openDeleteDialog(pemasukan)}
                            disabled={isPending}
                          >
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Belum ada data pemasukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data pemasukan untuk{' '}
              <span className="font-semibold">{itemToDelete?.description}</span> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
