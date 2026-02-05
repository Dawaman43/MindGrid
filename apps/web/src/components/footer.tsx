import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const FOOTER_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
];

const SECONDARY_LINKS = [
  { label: "Integrations", href: "/integrations" },
  { label: "Analytics", href: "/analytics" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "About", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">MindGrid</p>
            <h2 className="text-2xl font-semibold">Ready to centralize knowledge?</h2>
            <p className="text-sm text-muted-foreground">
              Launch in days, not months, with guided onboarding and governance workflows.
            </p>
          </div>
          <Link className={buttonVariants()} href="/login">
            Request demo
          </Link>
        </div>

        <div className="grid gap-6 border-t pt-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              MindGrid is the enterprise knowledge system for teams that need reliable, secure answers
              from every source.
            </p>
            <p>hello@mindgrid.ai • San Francisco, CA</p>
          </div>
          <div className="grid gap-6 text-sm md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Product</p>
              {FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href as any} className="block">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Company</p>
              {SECONDARY_LINKS.map((link) => (
                <Link key={link.href} href={link.href as any} className="block">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
