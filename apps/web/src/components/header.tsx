"use client";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/solutions", label: "Solutions" },
    { to: "/pricing", label: "Pricing" },
    { to: "/security", label: "Security" },
    { to: "/resources", label: "Resources" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/integrations", label: "Integrations" },
    { to: "/analytics", label: "Analytics" },
    { to: "/about", label: "About" },
  ] as const;

  return (
    <div className="border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <nav className="flex flex-wrap gap-4 text-sm font-medium md:text-base">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} href={to} className="text-muted-foreground transition-colors hover:text-foreground">
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link className={buttonVariants({ variant: "outline", size: "sm" })} href="/login">
            Request demo
          </Link>
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
