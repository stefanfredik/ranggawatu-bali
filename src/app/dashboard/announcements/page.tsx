import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnnouncements, getLoggedInUser } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  const loggedInUser = await getLoggedInUser();

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Announcements</h1>
          <p className="text-muted-foreground">
            Important updates and information for all members.
          </p>
        </div>
        {loggedInUser.role === 'admin' && (
          <Link href="/dashboard/announcements/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card key={ann.id}>
            <CardHeader>
              <CardTitle>{ann.title}</CardTitle>
              <CardDescription>
                Posted on {format(new Date(ann.date), "PPPP")} by {ann.author}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{ann.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
