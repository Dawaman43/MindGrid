import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const FEATURE_AREAS = [
  {
    title: "Unified search",
    description: "Search across docs, tickets, chats, and wikis from one workspace.",
  },
  {
    title: "AI answer orchestration",
    description: "Compose answers with citations and show the source of truth by default.",
  },
  {
    title: "Smart ingestion",
    description: "Incremental syncing, deduplication, and automatic metadata tagging.",
  },
  {
    title: "Governance controls",
    description: "Permissions-aware indexing and continuous access audits.",
  },
  {
    title: "Knowledge health",
    description: "Spot stale content, missing topics, and overdue updates.",
  },
  {
    title: "Team workspaces",
    description: "Tailor experiences for support, sales, engineering, and HR.",
  },
];

const USE_CASES = [
  {
    title: "Support enablement",
    description: "Reduce ticket handle time with instant troubleshooting answers.",
  },
  {
    title: "Revenue operations",
    description: "Surface pricing, competitive intel, and proposal collateral in seconds.",
  },
  {
    title: "People operations",
    description: "Keep policies, benefits, and onboarding guidance up to date.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Features</p>
            <h1 className="text-3xl font-semibold">Everything you need to operationalize knowledge.</h1>
            <p className="text-sm text-muted-foreground">
              Build a governed, searchable knowledge layer that adapts to every team.
            </p>
          </div>
          <Link className={buttonVariants({ variant: "outline" })} href="/pricing">
            View pricing
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURE_AREAS.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Designed for your workflows</CardTitle>
            <CardDescription>Prebuilt playbooks for the teams that rely on knowledge the most.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {USE_CASES.map((useCase) => (
              <div key={useCase.title} className="space-y-2">
                <p className="text-sm font-medium text-foreground">{useCase.title}</p>
                <p className="text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
