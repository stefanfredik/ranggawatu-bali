'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type User } from "@/lib/data";
import { updateProfile } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function ProfileClient({ user }: { user: User }) {
  const initialState = { message: null, errors: {}, success: false };
  const updateProfileWithId = updateProfile.bind(null, user.id);
  const [state, dispatch] = useActionState(updateProfileWithId, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success && state.message) {
      toast({
        title: "Success",
        description: state.message,
      });
      // Clear password fields on successful submission
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
      if (passwordInput) passwordInput.value = '';
      if (confirmPasswordInput) confirmPasswordInput.value = '';

    } else if (state.message && state.errors && Object.keys(state.errors).length === 0) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your account settings and personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="grid gap-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} data-ai-hint="avatar" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" type="button">Change Photo</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={user.name} />
                    {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={user.email} />
                    {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="birthdate">Birth Date</Label>
                    <Input id="birthdate" name="birthdate" type="date" defaultValue={user.birthDate} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" defaultValue={user.role} disabled className="capitalize" />
                </div>
            </div>

             <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" name="password" type="password" />
                    {state.errors?.password && <p className="text-sm font-medium text-destructive">{state.errors.password[0]}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" />
                     {state.errors?.confirmPassword && <p className="text-sm font-medium text-destructive">{state.errors.confirmPassword[0]}</p>}
                </div>
            </div>

            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
