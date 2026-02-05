import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const VALUES = [
  {
    title: "Customer clarity",
    description: "We design for the moment someone needs an answer, not a search result.",
  },
  {
    title: "Responsible AI",
    description: "Every answer is grounded in a verified source with transparent provenance.",
  },
  {
    title: "Operational rigor",
    description: "Security, governance, and access controls are non-negotiable foundations.",
  },
];

const MILESTONES = [
  {
    year: "2022",
    detail: "MindGrid founded by enterprise search and knowledge leaders.",
  },
  {
    year: "2023",
    detail: "Launched unified ingestion layer with 20+ connectors.",
  },
  {
    year: "2024",
    detail: "Introduced AI answer governance and cross-team analytics.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">About</p>
          <h1 className="text-3xl font-semibold">We help teams move from searching to knowing.</h1>
          <p className="text-sm text-muted-foreground">
            MindGrid is built for enterprises that need trustworthy, secure answers from every source.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {VALUES.map((value) => (
            <Card key={value.title}>
              <CardHeader>
                <CardTitle>{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our story</CardTitle>
            <CardDescription>Key moments in the MindGrid journey.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {MILESTONES.map((milestone) => (
              <div key={milestone.year} className="flex items-start justify-between gap-4 border-b pb-3">
                <span className="text-sm font-medium text-foreground">{milestone.year}</span>
                <span className="text-sm text-muted-foreground">{milestone.detail}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
