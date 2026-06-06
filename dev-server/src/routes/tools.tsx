import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { osintCategories } from "@/data/osint-tools";

export const Route = createFileRoute("/tools")({
  ssr: false,
  head: () => ({ meta: [{ title: "OSINT Tools — DocX Network" }] }),
  component: ToolsPage,
});

function ToolsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return osintCategories;
    return osintCategories
      .map((c) => ({
        ...c,
        tools: c.tools.filter(
          (t) => t.name.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.tools.length > 0);
  }, [query]);

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">OSINT Tools</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          A curated directory of open-source intelligence resources.
        </p>

        <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-input/40 px-3 focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="space-y-10">
        {filtered.map((cat) => (
          <section key={cat.name}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {cat.name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cat.tools.map((t) => (
                <a
                  key={t.name}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-border bg-card p-4 transition hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-medium">{t.name}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                </a>
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">No tools match "{query}".</p>
        )}
      </div>
    </AppShell>
  );
}
