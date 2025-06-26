import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserById } from "@/lib/data";
import { ArrowLeft, Edit, Mail, Cake, UserCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from 'date-fns';

export default async function MemberDetailsPage({ params }: { params: { id: string } }) {
  const member = await getUserById(params.id);

  if (!member) {
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
          <h1 className="text-2xl font-semibold">Member Details</h1>
          <p className="text-muted-foreground">Viewing profile for {member.name}.</p>
        </div>
        <div className="ml-auto">
             <Link href={`/dashboard/members/${member.id}/edit`}>
                <Button>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Member
                </Button>
            </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader className="items-center text-center border-b p-6">
            <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={member.avatar} data-ai-hint="avatar" />
                <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <CardTitle>{member.name}</CardTitle>
            <CardDescription>
                <Badge variant={member.role === 'admin' ? 'default' : 'secondary'} className="capitalize text-sm mt-1">
                    {member.role}
                </Badge>
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{member.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Cake className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Birth Date</p>
                        <p className="font-medium">{format(new Date(member.birthDate), "MMMM do, yyyy")}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Member ID</p>
                        <p className="font-mono text-xs">{member.id}</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
