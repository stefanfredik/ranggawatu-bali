'use client';

import { useState, useTransition, type FormEvent, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MoreHorizontal, DollarSign, UserCheck, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { markUangPangkalAsPaid } from '@/lib/actions';
import type { UserWithUangPangkal } from '@/lib/data.types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function UangPangkalClientPage({ members, uangPangkalAmount }: { members: UserWithUangPangkal[], uangPangkalAmount: number }) {
  const [memberToMark, setMemberToMark] = useState<UserWithUangPangkal | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const summary = useMemo(() => {
    const paidMembers = members.filter(m => m.uangPangkalStatus === 'Lunas');
    const unpaidMembers = members.filter(m => m.uangPangkalStatus === 'Belum Lunas');
    const totalCollected = paidMembers.reduce((sum, member) => sum + (member.uangPangkalAmount || 0), 0);

    return {
      totalCollected,
      paidCount: paidMembers.length,
      unpaidCount: unpaidMembers.length,
    };
  }, [members]);

  const handleMarkPaid = (member: UserWithUangPangkal) => {
    setMemberToMark(member);
    setPaymentDate(new Date());
  };

  const closeDialog = () => {
    setMemberToMark(null);
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!memberToMark || !paymentDate) return;

    startTransition(async () => {
      const result = await markUangPangkalAsPaid(memberToMark.id, format(paymentDate, 'yyyy-MM-dd'));
      if (result?.success) {
        toast({
          title: 'Pembayaran Berhasil',
          description: `Pembayaran uang pangkal untuk ${memberToMark.name} telah dicatat.`,
        });
        closeDialog();
      } else {
        toast({
          title: 'Error',
          description: result?.message || 'Gagal menandai sebagai lunas.',
          variant: 'destructive',
        });
      }
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || typeof amount !== 'number') return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <>
       <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uang Pangkal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalCollected)}</div>
            <p className="text-xs text-muted-foreground">Total dana terkumpul dari uang pangkal.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anggota Lunas</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.paidCount}</div>
            <p className="text-xs text-muted-foreground">Jumlah anggota yang telah membayar.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Lunas</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.unpaidCount}</div>
            <p className="text-xs text-muted-foreground">Jumlah anggota yang masih memiliki tunggakan.</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Status Uang Pangkal Anggota</CardTitle>
          <CardDescription>
            Daftar semua anggota dan status pembayaran uang pangkal sebesar {formatCurrency(uangPangkalAmount)}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anggota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Jumlah Setor</TableHead>
                <TableHead>Tanggal Setor</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} data-ai-hint="avatar" />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.uangPangkalStatus === 'Lunas' ? 'default' : 'secondary'}>
                      {member.uangPangkalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(member.uangPangkalAmount)}</TableCell>
                  <TableCell>
                    {member.uangPangkalDate ? format(new Date(member.uangPangkalDate), "PPP") : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                     {member.role !== 'admin' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => handleMarkPaid(member)} disabled={member.uangPangkalStatus === 'Lunas'}>
                                  Tandai Sudah Bayar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                     )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={!!memberToMark} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Tandai Sudah Bayar</DialogTitle>
              <DialogDescription>
                Pilih tanggal pembayaran uang pangkal untuk <span className="font-semibold">{memberToMark?.name}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="payment-date">Tanggal Pembayaran</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !paymentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {paymentDate ? format(paymentDate, "PPP") : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={paymentDate}
                      onSelect={setPaymentDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending || !paymentDate}>
                {isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
