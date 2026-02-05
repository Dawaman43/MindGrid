import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const INTEGRATIONS = [
  {
    name: "Google Workspace",
    status: "Connected",
    detail: "Drive, Docs, and Calendar syncing every 15 minutes.",
  },
  {
    name: "Microsoft 365",
    status: "Connected",
    detail: "SharePoint and Outlook indexed with SSO scopes.",
  },
  {
    name: "Slack",
    status: "Attention",
    detail: "Re-authentication required in 5 days.",
  },
  {
    name: "Confluence",
    status: "Connected",
    detail: "Spaces mapped to product and engineering teams.",
  },
  {
    name: "Jira",
    status: "Pending",
    detail: "Awaiting admin approval to connect projects.",
  },
  {
    name: "Notion",
    status: "Connected",
    detail: "Database sync includes roadmap and HR policies.",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Connected: "text-emerald-600",
  Attention: "text-amber-600",
  Pending: "text-muted-foreground",
};

export default function IntegrationsPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Integrations</p>
            <h1 className="text-3xl font-semibold">Connect the tools your teams rely on.</h1>
            <p className="text-sm text-muted-foreground">
              Monitor sync health, permissions, and coverage across every knowledge source.
            </p>
          </div>
          <Link className={buttonVariants()} href="/login">
            Add new source
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {INTEGRATIONS.map((integration) => (
            <Card key={integration.name}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{integration.name}</span>
                  <span className={`text-xs font-medium ${STATUS_STYLES[integration.status]}`}>
                    {integration.status}
                  </span>
                </CardTitle>
                <CardDescription>{integration.detail}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Last sync: {integration.status === "Pending" ? "Awaiting access" : "12 minutes ago"}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
