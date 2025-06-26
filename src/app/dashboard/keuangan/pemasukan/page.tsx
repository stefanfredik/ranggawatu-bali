import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PemasukanPage() {
  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-2xl font-semibold">Pemasukan</h1>
        <p className="text-muted-foreground">
          Kelola data pemasukan organisasi.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Data Pemasukan</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Halaman untuk mengelola data pemasukan akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
