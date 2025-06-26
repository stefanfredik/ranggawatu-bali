'use client';
import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeID } from 'date-fns/locale';
import { ArrowUpCircle, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deletePengeluaran } from '@/lib/actions';
import type { Pengeluaran, User } from "@/lib/data";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 50;

export function PengeluaranClientPage({ initialPengeluaran, loggedInUser }: { initialPengeluaran: Pengeluaran[], loggedInUser: User }) {
  const [pengeluaranList, setPengeluaranList] = useState<Pengeluaran[]>(initialPengeluaran);
  const [itemToDelete, setItemToDelete] = useState<Pengeluaran | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const canEdit = loggedInUser.role === 'admin' || loggedInUser.role === 'bendahara';

  const filteredPengeluaran = useMemo(() => {
    return pengeluaranList.filter((pengeluaran) =>
      pengeluaran.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pengeluaranList, searchTerm]);

  const totalSemuaPengeluaran = useMemo(() => {
    return pengeluaranList.reduce((sum, item) => sum + item.amount, 0);
  }, [pengeluaranList]);

  const totalPages = Math.ceil(filteredPengeluaran.length / ITEMS_PER_PAGE);
  const paginatedPengeluaran = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPengeluaran.slice(startIndex, endIndex);
  }, [filteredPengeluaran, currentPage]);

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

  const openDeleteDialog = (item: Pengeluaran) => {
    setItemToDelete(item);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    startTransition(async () => {
        const result = await deletePengeluaran(itemToDelete.id);
        if (result?.success) {
            if (paginatedPengeluaran.length === 1 && currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
            setPengeluaranList(currentList => currentList.filter(item => item.id !== itemToDelete.id));
            toast({
                title: "Data Dihapus",
                description: `Pengeluaran "${itemToDelete.description}" telah berhasil dihapus.`,
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
            <h1 className="text-2xl font-semibold">Pengeluaran</h1>
            <p className="text-muted-foreground">
              Kelola data pengeluaran organisasi.
            </p>
          </div>
          {canEdit && (
            <Button asChild>
              <Link href="/dashboard/keuangan/pengeluaran/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Pengeluaran
              </Link>
            </Button>
          )}
        </div>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Total Semua Pengeluaran
                </CardTitle>
                <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSemuaPengeluaran)}</div>
                <p className="text-xs text-muted-foreground">
                Total dari {pengeluaranList.length} transaksi pengeluaran yang tercatat.
                </p>
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Pengeluaran</CardTitle>
            <CardDescription>
              Berikut adalah daftar semua pengeluaran yang tercatat.
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
                {paginatedPengeluaran.length > 0 ? paginatedPengeluaran.map((pengeluaran) => (
                  <TableRow key={pengeluaran.id}>
                    <TableCell className="font-medium">{pengeluaran.description}</TableCell>
                    <TableCell className="hidden md:table-cell">{format(new Date(pengeluaran.date), "PPP", { locale: localeID })}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(pengeluaran.amount)}</TableCell>
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
                            <Link href={`/dashboard/keuangan/pengeluaran/${pengeluaran.id}`}>
                              <DropdownMenuItem>
                                Lihat Detail
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/dashboard/keuangan/pengeluaran/${pengeluaran.id}/edit`}>
                              <DropdownMenuItem>
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onSelect={() => openDeleteDialog(pengeluaran)}
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
                      {searchTerm ? "Tidak ada pengeluaran yang cocok dengan pencarian Anda." : "Belum ada data pengeluaran."}
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data pengeluaran untuk{' '}
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
