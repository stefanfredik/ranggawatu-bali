import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUsersWithUangPangkalStatus, UANG_PANGKAL_AMOUNT } from "@/lib/data";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

export default async function UangPangkalPage() {
  const members = await getUsersWithUangPangkalStatus();

  const formatCurrency = (amount: number | null) => {
    if (amount === null || typeof amount !== 'number') return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-2xl font-semibold">Uang Pangkal</h1>
        <p className="text-muted-foreground">
          Kelola dan lihat status pembayaran uang pangkal anggota.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Status Uang Pangkal Anggota</CardTitle>
          <CardDescription>
            Daftar semua anggota dan status pembayaran uang pangkal sebesar {formatCurrency(UANG_PANGKAL_AMOUNT)}.
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
                        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
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
                     {member.uangPangkalStatus !== 'Lunas' && member.role !== 'admin' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
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
    </div>
  );
}
