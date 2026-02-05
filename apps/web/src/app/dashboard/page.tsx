import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Knowledge command center
          </p>
          <h1 className="text-3xl font-semibold">Welcome back, {session.user.name}</h1>
          <p className="text-sm text-muted-foreground">
            Monitor coverage, keep sources healthy, and see what teams are asking today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Search confidence</CardTitle>
              <CardDescription>Signals from the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-semibold">94%</div>
              <p className="text-sm text-muted-foreground">
                Queries returning verified answers across connected sources.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Coverage status</CardTitle>
              <CardDescription>Sources actively syncing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-semibold">18 / 21</div>
              <p className="text-sm text-muted-foreground">
                Three sources need re-authentication in the next 7 days.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Knowledge gaps</CardTitle>
              <CardDescription>Open requests from teams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-semibold">7</div>
              <p className="text-sm text-muted-foreground">
                Assign owners to untrusted topics and close the loop.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <Card>
            <CardHeader>
              <CardTitle>Today’s activity</CardTitle>
              <CardDescription>Searches, answers, and updates in motion</CardDescription>
            </CardHeader>
            <CardContent>
              <Dashboard user={{ name: session.user.name ?? "Teammate", email: session.user.email ?? "" }} />
              <Dashboard session={session} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Keep the system healthy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Assign answer owners</p>
                <p>Route unanswered questions to domain experts.</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Review access audits</p>
                <p>Verify permissions for new hires and contractors.</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Configure alerts</p>
                <p>Get notified when a source fails or goes stale.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
