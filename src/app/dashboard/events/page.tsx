import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEvents, getLoggedInUser } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import { format } from 'date-fns';
import Link from "next/link";

export default async function EventsPage() {
  const events = await getEvents();
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return null; // The layout will handle the redirect.
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Events & Activities</h1>
          <p className="text-muted-foreground">Here is a list of all upcoming events.</p>
        </div>
        {loggedInUser.role === 'admin' && (
          <Button asChild>
            <Link href="/dashboard/events/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
           <Card key={event.id} className="flex flex-col">
           <CardHeader>
             <CardTitle>{event.title}</CardTitle>
             <CardDescription>{format(new Date(event.date), 'PPPP p')}</CardDescription>
           </CardHeader>
           <CardContent className="flex-grow">
             <p className="text-sm text-muted-foreground">{event.description}</p>
           </CardContent>
           <div className="p-6 pt-0">
             <Button variant="outline" className="w-full">View Details</Button>
           </div>
         </Card>
        ))}
      </div>
    </div>
  );
}
