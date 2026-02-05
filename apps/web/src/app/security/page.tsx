import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const CONTROLS = [
  {
    title: "SSO & SCIM",
    description: "SAML-based SSO, automatic provisioning, and deprovisioning.",
  },
  {
    title: "Role-based access",
    description: "Granular access rules aligned to your identity provider groups.",
  },
  {
    title: "Audit trails",
    description: "Track every access decision and answer delivered in a single timeline.",
  },
  {
    title: "Data residency",
    description: "Choose regional storage and processing zones for compliance needs.",
  },
  {
    title: "Encryption",
    description: "In-transit and at-rest encryption across ingestion and storage layers.",
  },
  {
    title: "Private indexing",
    description: "Keep sensitive content private with scoped indexing and masking rules.",
  },
];

const CERTIFICATIONS = ["SOC 2 Type II", "GDPR", "ISO 27001-ready", "HIPAA-aligned workflows"];

export default function SecurityPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Security</p>
            <h1 className="text-3xl font-semibold">Enterprise-grade governance, baked in.</h1>
            <p className="text-sm text-muted-foreground">
              Keep knowledge secure with end-to-end controls, audits, and compliance-ready workflows.
            </p>
          </div>
          <Link className={buttonVariants()} href="/login">
            Talk to security
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CONTROLS.map((control) => (
            <Card key={control.title}>
              <CardHeader>
                <CardTitle>{control.title}</CardTitle>
                <CardDescription>{control.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Compliance and certifications</CardTitle>
            <CardDescription>Designed to match regulated industry requirements.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {CERTIFICATIONS.map((cert) => (
              <span key={cert} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                {cert}
              </span>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
