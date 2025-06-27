import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAnnouncement } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { getLoggedInUser } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function NewAnnouncementPage() {
  const loggedInUser = await getLoggedInUser();
  if (loggedInUser?.role !== 'admin') {
    notFound();
  }

  return (
    <div className="grid gap-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/announcements">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Announcements</span>
            </Link>
          </Button>
        <div>
            <h1 className="text-2xl font-semibold">Create New Announcement</h1>
            <p className="text-muted-foreground">Fill in the details for the new announcement.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Announcement Details</CardTitle>
          <CardDescription>Please provide the title and content for the announcement.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createAnnouncement} className="grid gap-6">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="e.g., Important Update" required />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" name="content" placeholder="Write the announcement content here..." required className="min-h-[200px]" />
                </div>
            </div>
            
            <div className="flex justify-end gap-2">
                 <Button variant="outline" asChild>
                    <Link href="/dashboard/announcements">Cancel</Link>
                </Button>
                <Button type="submit">Post Announcement</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
