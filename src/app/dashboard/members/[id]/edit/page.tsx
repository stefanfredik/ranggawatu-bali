import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserById, getLoggedInUser } from "@/lib/data";
import { updateUser } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditMemberPage({ params }: { params: { id: string } }) {
  const loggedInUser = await getLoggedInUser();
  if (loggedInUser.role !== 'admin') {
    notFound();
  }
  
  const member = await getUserById(params.id);

  if (!member) {
    notFound();
  }

  const updateUserWithId = updateUser.bind(null, member.id);

  return (
    <div className="grid gap-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/members/${member.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Member Details</span>
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
          <form action={updateUserWithId} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" name="full-name" defaultValue={member.name} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" defaultValue={member.email} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" defaultValue={member.role}>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="bendahara">Bendahara</SelectItem>
                            <SelectItem value="ketua">Ketua</SelectItem>
                            <SelectItem value="wakil-ketua">Wakil Ketua</SelectItem>
                            <SelectItem value="sekretaris">Sekretaris</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="birthdate">Birth Date</Label>
                    <Input id="birthdate" name="birthdate" type="date" defaultValue={member.birthDate} />
                </div>
            </div>
            
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href={`/dashboard/members/${member.id}`}>Cancel</Link>
                </Button>
                <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
