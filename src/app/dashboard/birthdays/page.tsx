import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUsers } from "@/lib/data";
import { format } from "date-fns";

export default async function BirthdaysPage() {
  const users = await getUsers();
  const currentMonth = new Date().getMonth();
  const birthdayMembers = users.filter(user => new Date(user.birthDate).getMonth() === currentMonth);

  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-2xl font-semibold">Member Birthdays</h1>
        <p className="text-muted-foreground">Celebrating our members this month!</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>This Month&apos;s Celebrants ({format(new Date(), 'MMMM')})</CardTitle>
          <CardDescription>
            Let&apos;s wish a happy birthday to our colleagues!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {birthdayMembers.length > 0 ? birthdayMembers.map((user) => (
              <div key={user.id} className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} data-ai-hint="avatar" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(user.birthDate), "MMMM do")}
                  </p>
                </div>
              </div>
            )) : (
                <p className="col-span-full text-center text-muted-foreground">No birthdays this month.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
