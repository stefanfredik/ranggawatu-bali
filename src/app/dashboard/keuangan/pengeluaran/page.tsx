import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PengeluaranPage() {
  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-2xl font-semibold">Pengeluaran</h1>
        <p className="text-muted-foreground">
          Kelola data pengeluaran organisasi.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Data Pengeluaran</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Halaman untuk mengelola data pengeluaran akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
