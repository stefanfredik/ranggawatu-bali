'use client';
import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeID } from 'date-fns/locale';
import { ArrowDownCircle, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deletePemasukan } from '@/lib/actions';
import type { Pemasukan, User } from "@/lib/data";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 50;

export function PemasukanClientPage({ initialPemasukan, loggedInUser }: { initialPemasukan: Pemasukan[], loggedInUser: User }) {
  const [pemasukanList, setPemasukanList] = useState<Pemasukan[]>(initialPemasukan);
  const [itemToDelete, setItemToDelete] = useState<Pemasukan | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const canEdit = loggedInUser.role === 'admin' || loggedInUser.role === 'bendahara';

  const filteredPemasukan = useMemo(() => {
    return pemasukanList.filter((pemasukan) =>
      pemasukan.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pemasukanList, searchTerm]);

  const totalSemuaPemasukan = useMemo(() => {
    return pemasukanList.reduce((sum, item) => sum + item.amount, 0);
  }, [pemasukanList]);

  const totalPages = Math.ceil(filteredPemasukan.length / ITEMS_PER_PAGE);
  const paginatedPemasukan = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPemasukan.slice(startIndex, endIndex);
  }, [filteredPemasukan, currentPage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openDeleteDialog = (item: Pemasukan) => {
    setItemToDelete(item);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    startTransition(async () => {
        const result = await deletePemasukan(itemToDelete.id);
        if (result?.success) {
            // Adjust current page if the last item on a page is deleted
            if (paginatedPemasukan.length === 1 && currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
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
          {canEdit && (
            <Button asChild>
              <Link href="/dashboard/keuangan/pemasukan/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Pemasukan
              </Link>
            </Button>
          )}
        </div>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Total Semua Pemasukan
                </CardTitle>
                <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSemuaPemasukan)}</div>
                <p className="text-xs text-muted-foreground">
                Total dari {pemasukanList.length} transaksi pemasukan yang tercatat.
                </p>
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Pemasukan</CardTitle>
            <CardDescription>
              Berikut adalah daftar semua pemasukan yang tercatat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center pb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan deskripsi..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  {canEdit && <TableHead><span className="sr-only">Actions</span></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPemasukan.length > 0 ? paginatedPemasukan.map((pemasukan) => (
                  <TableRow key={pemasukan.id}>
                    <TableCell className="font-medium">{pemasukan.description}</TableCell>
                    <TableCell className="hidden md:table-cell">{format(new Date(pemasukan.date), "PPP", { locale: localeID })}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(pemasukan.amount)}</TableCell>
                    {canEdit && (
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
                    )}
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={canEdit ? 3 : 2} className="text-center">
                      {searchTerm ? "Tidak ada pemasukan yang cocok dengan pencarian Anda." : "Belum ada data pemasukan."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
             <div className="flex items-center justify-end space-x-2 py-4">
                <span className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages > 0 ? totalPages : 1}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Sebelumnya
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                >
                    Berikutnya
                </Button>
            </div>
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
