import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const INSIGHTS = [
  {
    title: "Top searched topics",
    description: "Launch planning, security access, and pricing enablement.",
  },
  {
    title: "Knowledge freshness",
    description: "76% of answers have been updated in the last 30 days.",
  },
  {
    title: "Content gaps",
    description: "HR onboarding and partner enablement need new docs.",
  },
];

const TEAMS = [
  { name: "Sales", value: "32%", detail: "Most active on product pricing and competitors." },
  { name: "Support", value: "24%", detail: "High volume of troubleshooting searches." },
  { name: "Engineering", value: "21%", detail: "Infrastructure and incident playbooks." },
  { name: "People Ops", value: "13%", detail: "Policy and onboarding workflows." },
];

const KPI = [
  { label: "Answers delivered", value: "14,280", detail: "+12% vs. last week" },
  { label: "Avg. response time", value: "1.8s", detail: "-0.3s improvement" },
  { label: "Adoption rate", value: "84%", detail: "+6% since last quarter" },
];

export default function AnalyticsPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Analytics</p>
          <h1 className="text-3xl font-semibold">Measure knowledge impact across the company.</h1>
          <p className="text-sm text-muted-foreground">
            See adoption trends, topic coverage, and the questions your teams need answered next.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {KPI.map((item) => (
            <Card key={item.label}>
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-semibold">{item.value}</div>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Insight highlights</CardTitle>
              <CardDescription>What the data is telling you right now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {INSIGHTS.map((insight) => (
                <div key={insight.title} className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Usage by team</CardTitle>
              <CardDescription>Top knowledge consumers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {TEAMS.map((team) => (
                <div key={team.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{team.name}</span>
                    <span>{team.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{team.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
