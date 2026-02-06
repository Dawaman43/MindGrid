import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-3xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          MindGrid Documentation
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Build with clarity: product guides, API references, and workflows in
          one place.
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Everything you need to design, integrate, and ship MindGrid faster—
          from quickstarts to system architecture and best practices.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/docs"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:opacity-90"
          >
            Start reading docs
          </Link>
          <Link
            href="/docs/backend-api-design"
            className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            View API architecture
          </Link>
        </div>
      </div>
      <div className="mt-12 grid w-full max-w-4xl gap-4 text-left sm:grid-cols-2">
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
              "Understand the service boundaries, tRPC surface, and data model.",
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
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-2xl border border-border p-5 transition hover:border-foreground/40 hover:bg-muted/60"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
