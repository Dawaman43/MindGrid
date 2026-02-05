import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const SOLUTIONS = [
  {
    title: "Customer support",
    description: "Resolve tickets faster with AI answers and verified macros.",
  },
  {
    title: "Revenue enablement",
    description: "Give sales teams instant access to pricing, contracts, and battlecards.",
  },
  {
    title: "Engineering knowledge",
    description: "Centralize runbooks, incidents, and architectural decisions.",
  },
  {
    title: "People operations",
    description: "Keep HR policies, onboarding steps, and benefits searchable.",
  },
  {
    title: "Legal & compliance",
    description: "Track policies, audits, and approvals with full provenance.",
  },
  {
    title: "Leadership reporting",
    description: "Measure knowledge adoption and uncover strategic gaps.",
  },
];

const OUTCOMES = [
  {
    label: "Time-to-answer",
    value: "-41%",
    detail: "Faster responses across support and ops teams.",
  },
  {
    label: "Content reuse",
    value: "+58%",
    detail: "Answer templates adopted by frontline teams.",
  },
  {
    label: "Compliance readiness",
    value: "99%",
    detail: "Answers backed by verified sources and audit trails.",
  },
];

export default function SolutionsPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Solutions</p>
            <h1 className="text-3xl font-semibold">Tailor MindGrid to every team in your org.</h1>
            <p className="text-sm text-muted-foreground">
              Purpose-built workflows help each department search, answer, and govern knowledge.
            </p>
          </div>
          <Link className={buttonVariants()} href="/login">
            Launch a workspace
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((solution) => (
            <Card key={solution.title}>
              <CardHeader>
                <CardTitle>{solution.title}</CardTitle>
                <CardDescription>{solution.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {OUTCOMES.map((outcome) => (
            <Card key={outcome.label}>
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {outcome.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-semibold">{outcome.value}</div>
                <p className="text-sm text-muted-foreground">{outcome.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
