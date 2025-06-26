import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DompetSaldoPage() {
  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-2xl font-semibold">Dompet Saldo</h1>
        <p className="text-muted-foreground">
          Lihat saldo kas organisasi.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dompet Saldo</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Halaman untuk melihat saldo kas akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
