import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UangPangkalPage() {
  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-2xl font-semibold">Uang Pangkal</h1>
        <p className="text-muted-foreground">
          Kelola data uang pangkal anggota.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Data Uang Pangkal</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Halaman untuk mengelola uang pangkal akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
