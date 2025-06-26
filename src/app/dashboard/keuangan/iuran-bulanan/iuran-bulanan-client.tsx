'use client';

import { useState, useTransition, type FormEvent, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Calendar as CalendarIcon, MoreHorizontal, DollarSign, UserCheck, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { markIuranAsPaid } from '@/lib/actions';
import type { UserWithIuranStatus } from '@/lib/data.types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const MONTHS = [
  { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
  { value: 4, label: 'April' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' }, { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' }, { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
];

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i);
  }
  return years;
};

export function IuranBulananClientPage({
  members,
  initialMonth,
  initialYear,
  iuranAmount,
}: {
  members: UserWithIuranStatus[];
  initialMonth: number;
  initialYear: number;
  iuranAmount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [memberToMark, setMemberToMark] = useState<UserWithIuranStatus | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const yearOptions = useMemo(() => getYearOptions(), []);

  const summary = useMemo(() => {
    const paidMembers = members.filter(m => m.iuranStatus === 'Lunas');
    const unpaidMembers = members.filter(m => m.iuranStatus === 'Belum Lunas');
    const totalCollected = paidMembers.reduce((sum, member) => sum + (member.iuranAmount || 0), 0);
    return {
      totalCollected,
      paidCount: paidMembers.length,
      unpaidCount: unpaidMembers.length,
    };
  }, [members]);

  const handleFilterChange = (type: 'month' | 'year', value: string) => {
    const newParams = new URLSearchParams();
    newParams.set('month', type === 'month' ? value : String(initialMonth));
    newParams.set('year', type === 'year' ? value : String(initialYear));
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleMarkPaid = (member: UserWithIuranStatus) => {
    setMemberToMark(member);
    setPaymentDate(new Date());
  };

  const closeDialog = () => setMemberToMark(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!memberToMark || !paymentDate) return;

    const formData = new FormData();
    formData.append('userId', memberToMark.id);
    formData.append('paymentDate', format(paymentDate, 'yyyy-MM-dd'));
    formData.append('month', String(initialMonth));
    formData.append('year', String(initialYear));

    startTransition(async () => {
      const result = await markIuranAsPaid(formData);
      if (result?.success) {
        toast({
          title: 'Pembayaran Berhasil',
          description: `Iuran bulanan untuk ${memberToMark.name} telah dicatat.`,
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
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Filter Periode</CardTitle>
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <Select value={String(initialMonth)} onValueChange={(val) => handleFilterChange('month', val)}>
              <SelectTrigger><SelectValue placeholder="Pilih Bulan" /></SelectTrigger>
              <SelectContent>
                {MONTHS.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={String(initialYear)} onValueChange={(val) => handleFilterChange('year', val)}>
              <SelectTrigger><SelectValue placeholder="Pilih Tahun" /></SelectTrigger>
              <SelectContent>
                {yearOptions.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terkumpul Bulan Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalCollected)}</div>
            <p className="text-xs text-muted-foreground">Untuk periode {MONTHS.find(m => m.value === initialMonth)?.label} {initialYear}</p>
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
          <CardTitle>Status Iuran Anggota</CardTitle>
          <CardDescription>
            Daftar status pembayaran iuran sebesar {formatCurrency(iuranAmount)} untuk periode yang dipilih.
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
                      <Avatar className="h-10 w-10"><AvatarImage src={member.avatar} data-ai-hint="avatar" /><AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback></Avatar>
                      <div><p className="font-medium">{member.name}</p><p className="text-sm text-muted-foreground">{member.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={member.iuranStatus === 'Lunas' ? 'default' : 'secondary'}>{member.iuranStatus}</Badge></TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(member.iuranAmount)}</TableCell>
                  <TableCell>{member.iuranDate ? format(new Date(member.iuranDate), "PPP", { locale: localeID }) : '-'}</TableCell>
                  <TableCell className="text-right">
                     {member.role !== 'admin' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => handleMarkPaid(member)} disabled={member.iuranStatus === 'Lunas'}>Tandai Sudah Bayar</DropdownMenuItem>
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
              <DialogTitle>Tandai Sudah Bayar Iuran</DialogTitle>
              <DialogDescription>
                Pilih tanggal pembayaran untuk <span className="font-semibold">{memberToMark?.name}</span> periode {MONTHS.find(m => m.value === initialMonth)?.label} {initialYear}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="payment-date">Tanggal Pembayaran</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !paymentDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{paymentDate ? format(paymentDate, "PPP") : <span>Pilih tanggal</span>}</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={paymentDate} onSelect={setPaymentDate} initialFocus /></PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>Batal</Button>
              <Button type="submit" disabled={isPending || !paymentDate}>{isPending ? 'Menyimpan...' : 'Simpan'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
