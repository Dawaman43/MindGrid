"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

const TRUST_POINTS = [
  "SOC2-ready access controls",
  "Audit trails for every answer",
  "Private-by-default permissions",
];

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Secure access</p>
            <h1 className="text-4xl font-semibold leading-tight">Bring your company knowledge to life.</h1>
            <p className="text-base text-muted-foreground">
              Create a MindGrid workspace to connect sources, automate access controls, and deliver
              AI answers that your teams can trust.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Enterprise-ready from day one</CardTitle>
              <CardDescription>Security and governance features included.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {TRUST_POINTS.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-foreground/70" />
                  <span>{point}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="rounded-none border bg-card text-card-foreground">
          {showSignIn ? (
            <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
