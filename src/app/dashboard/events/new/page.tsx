import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEvent } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { getLoggedInUser } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function NewEventPage() {
  const loggedInUser = await getLoggedInUser();
  if (loggedInUser.role !== 'admin') {
    notFound();
  }

  return (
    <div className="grid gap-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/events">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Events</span>
            </Link>
          </Button>
        <div>
            <h1 className="text-2xl font-semibold">Create New Event</h1>
            <p className="text-muted-foreground">Fill in the details to schedule a new event.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Please provide the required information for the new event.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createEvent} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" name="title" placeholder="e.g., Monthly General Meeting" required />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="date">Date & Time</Label>
                    <Input id="date" name="date" type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} required />
                </div>
                 <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Provide a brief description of the event..." required />
                </div>
            </div>
            
            <div className="flex justify-end gap-2">
                 <Button variant="outline" asChild>
                    <Link href="/dashboard/events">Cancel</Link>
                </Button>
                <Button type="submit">Create Event</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
