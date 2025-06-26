'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { registerUser } from '@/lib/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function RegisterButton() {
  const { pending } = useFormStatus();
 
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? "Creating account..." : "Create an account"}
    </Button>
  );
}

export default function RegisterPage() {
  const [state, dispatch] = useFormState(registerUser, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" name="name" placeholder="John Doe" required />
              {state?.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="m@example.com" required />
              {state?.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required />
              {state?.errors?.password && <p className="text-sm font-medium text-destructive">{state.errors.password[0]}</p>}
            </div>
            
            {state?.message && (
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Registration Failed</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <RegisterButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
