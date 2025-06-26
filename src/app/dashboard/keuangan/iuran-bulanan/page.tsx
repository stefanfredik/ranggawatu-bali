import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function IuranBulananPage() {
  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-2xl font-semibold">Iuran Bulanan</h1>
        <p className="text-muted-foreground">
          Kelola data iuran bulanan anggota.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Data Iuran Bulanan</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Halaman untuk mengelola iuran bulanan akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
