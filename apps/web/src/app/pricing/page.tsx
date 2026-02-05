import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const TIERS = [
  {
    name: "Foundation",
    price: "$24 / user",
    description: "For growing teams centralizing knowledge fast.",
    features: [
      "Core search + AI answers",
      "Up to 5 integrations",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For regulated orgs with governance and compliance needs.",
    features: [
      "Unlimited integrations",
      "Advanced governance",
      "Custom data residency",
      "Dedicated success manager",
    ],
  },
  {
    name: "Scale",
    price: "$48 / user",
    description: "For multi-team rollouts with deeper analytics.",
    features: ["Everything in Foundation", "Advanced analytics", "Priority support", "SSO + SCIM"],
  },
];

const ADD_ONS = [
  "Premium connectors",
  "AI answer tuning",
  "24/7 support",
  "Migration services",
];

export default function PricingPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Pricing</p>
            <h1 className="text-3xl font-semibold">Plans for every knowledge maturity stage.</h1>
            <p className="text-sm text-muted-foreground">
              Start simple, scale into governance, and grow with full visibility.
            </p>
          </div>
          <Link className={buttonVariants()} href="/login">
            Contact sales
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map((tier) => (
            <Card key={tier.name}>
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="text-2xl font-semibold text-foreground">{tier.price}</p>
                <div className="space-y-2">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add-ons</CardTitle>
            <CardDescription>Extend MindGrid to match your roadmap.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {ADD_ONS.map((addon) => (
              <span key={addon} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                {addon}
              </span>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
