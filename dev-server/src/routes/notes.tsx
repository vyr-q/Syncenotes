import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, NotebookPen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Note = {
  id: string;
  title: string;
  content: string;
  updated_at: string;
};

export const Route = createFileRoute("/notes")({
  ssr: false,
  head: () => ({ meta: [{ title: "Notes — DocX Network" }] }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = notes.find((n) => n.id === activeId) ?? null;

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, updated_at")
        .order("updated_at", { ascending: false });
      if (error) toast.error(error.message);
      else {
        setNotes(data ?? []);
        if (data && data.length > 0) setActiveId(data[0].id);
      }
      setLoading(false);
    })();
  }, []);

  async function createNote() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data, error } = await supabase
      .from("notes")
      .insert({ user_id: userData.user.id, title: "Untitled", content: "" })
      .select("id, title, content, updated_at")
      .single();
    if (error) return toast.error(error.message);
    setNotes((n) => [data, ...n]);
    setActiveId(data.id);
  }

  async function deleteNote(id: string) {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setNotes((list) => {
      const next = list.filter((n) => n.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  }

  function updateLocal(patch: Partial<Note>) {
    if (!active) return;
    setNotes((list) =>
      list.map((n) => (n.id === active.id ? { ...n, ...patch, updated_at: new Date().toISOString() } : n)),
    );
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(active.id, patch), 500);
  }

  async function persist(id: string, patch: Partial<Note>) {
    const { error } = await supabase
      .from("notes")
      .update({ title: patch.title, content: patch.content })
      .eq("id", id);
    if (error) toast.error(error.message);
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Notes</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Private notes, saved to your account.</p>
        </div>
        <button
          onClick={createNote}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New note
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <NotebookPen className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No notes yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          <aside className="rounded-xl border border-border bg-card">
            <ul className="max-h-[70vh] divide-y divide-border overflow-y-auto">
              {notes.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => setActiveId(n.id)}
                    className={`w-full px-3 py-3 text-left transition ${
                      n.id === activeId ? "bg-primary/10" : "hover:bg-secondary"
                    }`}
                  >
                    <div className="truncate text-sm font-medium">{n.title || "Untitled"}</div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {n.content.slice(0, 60) || "Empty note"}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="rounded-xl border border-border bg-card p-5">
            {active ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <input
                    value={active.title}
                    onChange={(e) => updateLocal({ title: e.target.value })}
                    placeholder="Title"
                    className="w-full bg-transparent text-xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => deleteNote(active.id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={active.content}
                  onChange={(e) => updateLocal({ content: e.target.value })}
                  placeholder="Start writing…"
                  className="mt-4 min-h-[60vh] w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Saved {new Date(active.updated_at).toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select a note.</p>
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}
