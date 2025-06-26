import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createUser } from "@/lib/actions";
import { getLoggedInUser } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function NewMemberPage() {
  const loggedInUser = await getLoggedInUser();
  if (loggedInUser.role !== 'admin') {
    notFound();
  }

  return (
    <div className="grid gap-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/members">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Members</span>
            </Link>
          </Button>
        <div>
            <h1 className="text-2xl font-semibold">Add New Member</h1>
            <p className="text-muted-foreground">Fill in the details to add a new member to the organization.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
          <CardDescription>Please provide the necessary information for the new member.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createUser} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" name="full-name" placeholder="e.g., John Doe" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="e.g., john.doe@example.com" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" defaultValue="member">
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="bendahara">Bendahara</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="birthdate">Birth Date</Label>
                    <Input id="birthdate" name="birthdate" type="date" />
                </div>
            </div>
            
            <div className="flex justify-end gap-2">
                 <Button variant="outline" asChild>
                    <Link href="/dashboard/members">Cancel</Link>
                </Button>
                <Button type="submit">Add Member</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
