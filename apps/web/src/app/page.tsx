"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";

const FEATURES = [
  {
    title: "Unified knowledge search",
    description:
      "Connect docs, chats, and ticketing tools into a single searchable surface with semantic ranking.",
  },
  {
    title: "Instant AI answers",
    description:
      "Ask questions in natural language and get concise answers with citations from trusted sources.",
  },
  {
    title: "Automated governance",
    description:
      "Respect permissions and lifecycle rules with role-aware access controls and content audits.",
  },
];

const WORKFLOW_STEPS = [
  {
    title: "Connect your sources",
    description: "Authorize the tools your teams already use and let MindGrid index them securely.",
  },
  {
    title: "Enrich the knowledge base",
    description:
      "Automatic tagging, summarization, and embeddings keep the catalog organized and up to date.",
  },
  {
    title: "Serve every team",
    description: "Search, ask, and analyze with tailored experiences for each role and department.",
  },
];

const INTEGRATIONS = [
  "Google Workspace",
  "Microsoft 365",
  "Slack",
  "Teams",
  "Confluence",
  "SharePoint",
  "Notion",
  "Linear",
  "Jira",
];

const METRICS = [
  {
    label: "Search time saved",
    value: "48%",
    description: "Average reduction in time spent looking for answers.",
  },
  {
    label: "Knowledge coverage",
    value: "120k+",
    description: "Documents, chats, and tickets indexed across teams.",
  },
  {
    label: "Trusted answers",
    value: "98%",
    description: "Responses delivered with traceable citations.",
  },
];

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  const status = healthCheck.isLoading
    ? { label: "Checking API", className: "bg-amber-500" }
    : healthCheck.data
      ? { label: "API Online", className: "bg-emerald-500" }
      : { label: "API Offline", className: "bg-rose-500" };

  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute left-1/2 top-0 h-48 w-[40rem] -translate-x-1/2 rounded-full bg-muted/60 blur-3xl" />
        <div className="container relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-12">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="rounded-full border px-3 py-1">MindGrid</span>
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${status.className}`} />
              {status.label}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Find answers across your company knowledge, instantly.
              </h1>
              <p className="text-base text-muted-foreground md:text-lg">
                MindGrid centralizes documents, chats, and tickets into a governed knowledge layer so
                every team can search, ask, and act with confidence.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link className={buttonVariants()} href="/dashboard">
                  View dashboard
                </Link>
                <Link className={buttonVariants({ variant: "outline" })} href="/login">
                  Connect data sources
                </Link>
              </div>
            </div>
            <Card className="bg-background/80">
              <CardHeader>
                <CardTitle>Launch checklist</CardTitle>
                <CardDescription>Everything you need to go live in a week.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>SSO & RBAC alignment</span>
                  <span className="font-medium text-foreground">Day 1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Source connectors</span>
                  <span className="font-medium text-foreground">Day 2-3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Knowledge gap audit</span>
                  <span className="font-medium text-foreground">Day 4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Team rollout</span>
                  <span className="font-medium text-foreground">Day 5</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} size="sm">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold">From scattered docs to guided answers.</h2>
            </div>
            <div className="grid gap-5">
              {WORKFLOW_STEPS.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Built for your stack</CardTitle>
              <CardDescription>Prebuilt connectors with audit-ready sync logs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {INTEGRATIONS.map((integration) => (
                  <span
                    key={integration}
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {integration}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <div className="container mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
          {METRICS.map((metric) => (
            <Card key={metric.label}>
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-semibold">{metric.value}</div>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
