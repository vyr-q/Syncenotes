import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench, NotebookPen, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard — DocX Network" }] }),
  component: Dashboard,
});

function Dashboard() {
  const cards = [
    {
      to: "/tools" as const,
      icon: Wrench,
      title: "OSINT Tools",
      desc: "Curated directory of open-source intelligence resources.",
    },
    {
      to: "/notes" as const,
      icon: NotebookPen,
      title: "Notes",
      desc: "Private notes synced to your account.",
    },
  ];
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold tracking-tight">Visual knowledge workspace</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Jump back into your tools and notes.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{c.title}</h2>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
