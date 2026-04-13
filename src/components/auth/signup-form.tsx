"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

import { signup, type AuthFormState } from "@/app/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating account…" : "Create account"}
    </Button>
  );
}

interface SignupFormProps {
  disabled?: boolean;
}

export function SignupForm({ disabled }: SignupFormProps) {
  const [state, formAction] = useFormState(signup, undefined);

  if (state?.needsEmailConfirmation) {
    return (
      <Alert variant="success">
        <AlertDescription>
          Check your inbox to confirm your email. After confirming, you will be
          signed in and redirected to your dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          required
          disabled={disabled}
          placeholder="Alex Rivera"
        />
        {state?.fieldErrors?.fullName?.[0] ? (
          <p className="text-xs text-destructive">{state.fieldErrors.fullName[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={disabled}
          placeholder="you@example.com"
        />
        {state?.fieldErrors?.email?.[0] ? (
          <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">I am signing up as</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background p-3 text-sm shadow-sm has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-ring">
            <input
              type="radio"
              name="role"
              value="customer"
              defaultChecked
              disabled={disabled}
              className="h-4 w-4 accent-primary"
            />
            <span>
              <span className="block font-medium">Customer</span>
              <span className="text-xs text-muted-foreground">
                Book local services
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background p-3 text-sm shadow-sm has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-ring">
            <input
              type="radio"
              name="role"
              value="provider"
              disabled={disabled}
              className="h-4 w-4 accent-primary"
            />
            <span>
              <span className="block font-medium">Provider</span>
              <span className="text-xs text-muted-foreground">
                List your business
              </span>
            </span>
          </label>
        </div>
        {state?.fieldErrors?.role?.[0] ? (
          <p className="text-xs text-destructive">{state.fieldErrors.role[0]}</p>
        ) : null}
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          disabled={disabled}
          minLength={8}
        />
        {state?.fieldErrors?.password?.[0] ? (
          <p className="text-xs text-destructive">
            {state.fieldErrors.password[0]}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            At least 8 characters.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          disabled={disabled}
        />
        {state?.fieldErrors?.confirm?.[0] ? (
          <p className="text-xs text-destructive">
            {state.fieldErrors.confirm[0]}
          </p>
        ) : null}
      </div>

      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <SubmitButton />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
