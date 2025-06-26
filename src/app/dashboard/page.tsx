import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { announcements, events, loggedInUser } from "@/lib/data";
import { ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {loggedInUser.name}!</h1>
        {loggedInUser.role === 'admin' && (
          <Link href="/dashboard/events">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </Link>
        )}
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
                <li key={ann.id} className="p-4 rounded-lg border bg-card/50">
                  <h3 className="font-semibold">{ann.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">{format(new Date(ann.date), 'PPP')} by {ann.author}</p>
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
                  <div className="flex flex-col items-center justify-center p-2 rounded-md bg-primary/10 text-primary">
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
