import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/30 via-sky-400/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-12 h-48 w-48 rounded-full bg-gradient-to-tr from-fuchsia-400/20 via-amber-300/20 to-transparent blur-3xl" />
      </div>
      <div className="relative max-w-3xl space-y-6">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-sm">
          MindGrid Documentation
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Build with clarity: product guides, API references, and delivery
          playbooks in one place.
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Everything you need to design, integrate, and ship MindGrid faster—
          from quickstarts to system architecture, UX patterns, and launch
          readiness.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/docs"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background shadow-lg shadow-foreground/20 transition hover:opacity-90"
          >
            Start reading docs
          </Link>
          <Link
            href="/docs/product-overview"
            className="rounded-full border border-border bg-background/60 px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Explore product overview
          </Link>
        </div>
      </div>
      <div className="relative mt-10 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        {["Product", "Platform", "Web", "Mobile", "Analytics"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-background/70 px-4 py-2"
          >
            {tag} ready
          </span>
        ))}
      </div>
      <div className="relative mt-12 grid w-full max-w-5xl gap-4 text-left sm:grid-cols-2">
        {[
          {
            title: "Product overview",
            description:
              "Learn the core workflows, personas, and success metrics.",
            href: "/docs/product-overview",
          },
          {
            title: "Backend & API design",
            description:
              "Understand service boundaries, the tRPC surface, and data model.",
            href: "/docs/backend-api-design",
          },
          {
            title: "Implementation workflows",
            description:
              "See how we scope, build, review, and ship MindGrid features.",
            href: "/docs/implementation-workflows",
          },
          {
            title: "Release readiness",
            description:
              "Run the launch checklist and confirm ownership before shipping.",
            href: "/docs/release-readiness",
          },
          {
            title: "Component patterns",
            description:
              "Apply content structures and reusable documentation blocks.",
            href: "/docs/test",
          },
          {
            title: "Roadmap & milestones",
            description:
              "Track what’s shipping next and how each team contributes.",
            href: "/docs/roadmap",
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-2xl border border-border bg-background/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-muted/60 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition group-hover:text-foreground">
                Open
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
