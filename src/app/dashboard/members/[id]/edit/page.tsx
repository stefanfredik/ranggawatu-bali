'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { users } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, useRouter } from "next/navigation";

export default function EditMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const member = users.find(u => u.id === params.id);

  if (!member) {
    notFound();
  }

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here,
    // update the data, and then redirect.
    // For this demo, we'll just navigate back to the members list.
    router.push('/dashboard/members');
  };

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
            <h1 className="text-2xl font-semibold">Edit Member</h1>
            <p className="text-muted-foreground">Update the information for {member.name}.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
          <CardDescription>Make changes to the member's details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateMember} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" defaultValue={member.name} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={member.email} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue={member.role}>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="birthdate">Birth Date</Label>
                    <Input id="birthdate" type="date" defaultValue={member.birthDate} />
                </div>
            </div>
            
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/members">Cancel</Link>
                </Button>
                <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
