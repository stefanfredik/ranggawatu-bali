import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loggedInUser } from "@/lib/data";

export default function ProfilePage() {
  return (
    <div className="grid gap-6">
       <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account settings and personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={loggedInUser.avatar} data-ai-hint="avatar" />
                        <AvatarFallback>{loggedInUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Photo</Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={loggedInUser.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={loggedInUser.email} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="birthdate">Birth Date</Label>
                        <Input id="birthdate" type="date" defaultValue={loggedInUser.birthDate} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue={loggedInUser.role} disabled className="capitalize" />
                    </div>
                </div>

                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input id="password" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                </div>
                
                <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}
