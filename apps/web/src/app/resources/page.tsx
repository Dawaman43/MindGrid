import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const RESOURCES = [
  {
    title: "Onboarding guide",
    description: "Step-by-step rollout plan for enterprise teams.",
  },
  {
    title: "Connector checklist",
    description: "Prepare IT, security, and data owners before integration.",
  },
  {
    title: "Knowledge audit template",
    description: "Identify gaps and prioritize content to ingest.",
  },
  {
    title: "Governance playbook",
    description: "Best practices for permissions and compliance.",
  },
];

const HIGHLIGHTS = [
  {
    title: "Customer story",
    description: "How a 5k-person org accelerated answers by 40%.",
    link: "/resources",
  },
  {
    title: "Product update",
    description: "New analytics workspace for leadership dashboards.",
    link: "/analytics",
  },
  {
    title: "Integration guide",
    description: "Map permissions and data owners for secure ingestion.",
    link: "/integrations",
  },
];

export default function ResourcesPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Resources</p>
            <h1 className="text-3xl font-semibold">Guides, playbooks, and customer stories.</h1>
            <p className="text-sm text-muted-foreground">
              Everything you need to plan, launch, and scale knowledge operations.
            </p>
          </div>
          <Link className={buttonVariants({ variant: "outline" })} href="/login">
            Request a demo
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {RESOURCES.map((resource) => (
            <Card key={resource.title}>
              <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link className={buttonVariants({ variant: "ghost" })} href="/resources">
                  View resource
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Latest highlights</CardTitle>
            <CardDescription>Recent product news and customer wins.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {HIGHLIGHTS.map((highlight) => (
              <div key={highlight.title} className="space-y-2">
                <p className="text-sm font-medium text-foreground">{highlight.title}</p>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
                <Link className={buttonVariants({ variant: "link" })} href={highlight.link}>
                  Read more
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
