import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnnouncements, getEvents, getLoggedInUser, getDashboardFinancialSummary } from "@/lib/data";
import { ArrowRight, Megaphone, PlusCircle, Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';

export default async function DashboardPage() {
  const loggedInUser = await getLoggedInUser();
  const announcements = await getAnnouncements();
  const events = await getEvents();
  const financialSummary = await getDashboardFinancialSummary();
  const currentYear = new Date().getFullYear();

  if (!loggedInUser) {
    return null; // The layout will handle the redirect.
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {loggedInUser.name}!</h1>
        {loggedInUser.role === 'admin' && (
          <Link href="/dashboard/events/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </Link>
        )}
      </div>

       <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dompet Saldo
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialSummary.dompetSaldo)}</div>
            <p className="text-xs text-muted-foreground">
              Total saldo kas saat ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pemasukan Tahun {currentYear}
            </CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalPemasukanTahunan)}</div>
            <p className="text-xs text-muted-foreground">
              Total pemasukan di tahun ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengeluaran Tahun {currentYear}</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalPengeluaranTahunan)}</div>
            <p className="text-xs text-muted-foreground">
              Total pengeluaran di tahun ini
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Recent Announcements</CardTitle>
                <Link href="/dashboard/announcements" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                    View All
                    <ArrowRight className="h-4 w-4"/>
                </Link>
            </div>
            <CardDescription>Stay updated with the latest news from the organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {announcements.slice(0, 3).map((ann) => (
                <li key={ann.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">{format(new Date(ann.date), 'PPP')} by {ann.author}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center justify-between">
                <CardTitle>Upcoming Events</CardTitle>
                 <Link href="/dashboard/events" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                    View All
                    <ArrowRight className="h-4 w-4"/>
                </Link>
            </div>
            <CardDescription>Don&apos;t miss out on our upcoming activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {events.slice(0, 3).map((event) => (
                <li key={event.id} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                    <span className="text-sm font-bold">{format(new Date(event.date), 'dd')}</span>
                    <span className="text-xs">{format(new Date(event.date), 'MMM')}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'PP p')}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
