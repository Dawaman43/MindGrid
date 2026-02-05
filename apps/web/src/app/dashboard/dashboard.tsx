"use client";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

const ACTIVITY_FEED = [
  {
    title: "Finance handbook updated",
    description: "New reimbursement policy synced from Notion.",
    time: "15 min ago",
  },
  {
    title: "Product launch Q&A",
    description: "12 answers generated with citations.",
    time: "1 hour ago",
  },
  {
    title: "Support macros indexed",
    description: "Slack and Zendesk threads now searchable.",
    time: "3 hours ago",
  },
];

const TOP_QUERIES = [
  "How do I request a vendor contract?",
  "Q3 launch timeline and owners",
  "SOC2 evidence checklist",
];

export default function Dashboard({ session }: { session: typeof authClient.$Infer.Session }) {
  const privateData = useQuery(trpc.privateData.queryOptions());
  const apiMessage = privateData.data?.message ?? "Loading secure data...";

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Secure API status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{apiMessage}</p>
            <p>Signed in as {session.user?.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top knowledge requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {TOP_QUERIES.map((query) => (
              <div key={query} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />
                <span>{query}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {ACTIVITY_FEED.map((item) => (
          <div key={item.title} className="flex items-start justify-between gap-4 border-b pb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <span className="text-xs text-muted-foreground">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
