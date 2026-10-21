import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Loader2, LogOut, Download } from "lucide-react";
import { CATEGORIES, STATUSES, categoryById } from "@/lib/categories";
import { Logo } from "@/components/Header";

// Status badge colours — Tailwind inline style to avoid purge issues
const STATUS_COLOURS = {
  Pending: { bg: "oklch(0.45 0.08 80 / 0.25)", text: "oklch(0.9 0.1 85)" },
  "Under Review": { bg: "oklch(0.35 0.08 240 / 0.30)", text: "oklch(0.7 0.12 245)" },
  Shortlisted: { bg: "oklch(0.35 0.1 290 / 0.30)", text: "oklch(0.75 0.14 295)" },
  Selected: { bg: "oklch(0.3 0.1 155 / 0.30)", text: "oklch(0.75 0.15 155)" },
  Rejected: { bg: "oklch(0.35 0.12 25 / 0.30)", text: "oklch(0.65 0.21 25)" },
};

function StatusBadge({ status }) {
  const c = STATUS_COLOURS[status] ?? {};
  return (
    <span
      style={{ backgroundColor: c.bg, color: c.text }}
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5"
    >
      {status}
    </span>
  );
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Super AI Creator Excellence Awards 2026" },
      { name: "description", content: "Reviewer dashboard for award applications." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Dashboard" },
      { property: "og:description", content: "Reviewer dashboard for award applications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const fileUrl = (p) => `/api/admin/file?path=${encodeURIComponent(p)}`;

function Login({ onDone }) {
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    r.ok ? onDone() : setErr(d.error || "Login failed");
  }
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8"
      >
        <Logo />
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input
          className="field"
          type="email"
          placeholder="Email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          required
        />
        <input
          className="field"
          type="password"
          placeholder="Password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
          required
        />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button
          disabled={busy}
          className="w-full rounded-full bg-gold-gradient py-2.5 font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function toCsv(rows) {
  const cols = [
    "reference_no",
    "created_at",
    "status",
    "full_name",
    "phone",
    "email",
    "city",
    "state",
    "pincode",
    "profile_link",
    "category",
    "content_link_1",
    "content_link_2",
    "content_link_3",
    "reviewer_notes",
  ];
  const esc = (x) => `"${String(x ?? "").replace(/"/g, '""')}"`;
  return [
    cols.join(","),
    ...rows.map((r) =>
      cols
        .map((c) => {
          if (c === "category") {
            const cats = Array.isArray(r[c]) ? r[c] : [r[c]];
            return esc(cats.map((id) => categoryById(id)?.name || id).join("; "));
          }
          return esc(r[c]);
        })
        .join(","),
    ),
  ].join("\n");
}

function Detail({ app, onSaved }) {
  const [status, setStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.reviewer_notes || "");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setStatus(app.status);
    setNotes(app.reviewer_notes || "");
    setMsg("");
    setSaving(false);
  }, [app.id]);
  async function save() {
    setSaving(true);
    setMsg("");
    const r = await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: app.id, status, notes }),
    });
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (r.ok) {
      onSaved(d.application);
      setMsg("Saved ✓");
    } else setMsg(d.error || "Failed");
  }
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5 text-sm">
      <div className="flex items-start gap-4">
        <a href={fileUrl(app.profile_image)} target="_blank" rel="noreferrer">
          <img
            src={fileUrl(app.profile_image)}
            alt="Applicant"
            className="h-20 w-20 rounded-lg object-cover"
          />
        </a>
        <div>
          <h3 className="text-lg font-semibold">{app.full_name}</h3>
          <p className="text-gold">{app.reference_no}</p>
          <p className="text-muted-foreground">
            {(Array.isArray(app.category) ? app.category : [app.category])
              .map((id) => categoryById(id)?.name)
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      </div>
      <dl className="grid grid-cols-[7rem_1fr] gap-y-1 break-all">
        <dt className="text-muted-foreground">Phone</dt>
        <dd>+91 {app.phone}</dd>
        <dt className="text-muted-foreground">Email</dt>
        <dd>{app.email}</dd>
        <dt className="text-muted-foreground">Location</dt>
        <dd>
          {app.city}, {app.state} – {app.pincode}
        </dd>
        <dt className="text-muted-foreground">Profile</dt>
        <dd>
          <a
            className="text-gold underline"
            href={app.profile_link}
            target="_blank"
            rel="noreferrer noopener"
          >
            {app.profile_link}
          </a>
        </dd>
        {[app.content_link_1, app.content_link_2, app.content_link_3].map((l, i) => (
          <Fragment key={i}>
            <dt className="text-muted-foreground">Content {i + 1}</dt>
            <dd>
              <a className="text-gold underline" href={l} target="_blank" rel="noreferrer noopener">
                {l}
              </a>
            </dd>
          </Fragment>
        ))}
        <dt className="text-muted-foreground">Submitted</dt>
        <dd>{new Date(app.created_at).toLocaleString()}</dd>
      </dl>
      <div className="grid grid-cols-3 gap-2">
        {(app.screenshots || []).map((p) => (
          <a key={p} href={fileUrl(p)} target="_blank" rel="noreferrer">
            <img
              src={fileUrl(p)}
              alt="Screenshot"
              loading="lazy"
              className="h-24 w-full rounded object-cover"
            />
          </a>
        ))}
      </div>
      <select
        className="field"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={saving}
      >
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <textarea
        className="field min-h-24"
        placeholder="Internal reviewer notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={saving}
      />
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2 font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving…" : "Save"}
        </button>
        {msg && <span className="text-muted-foreground">{msg}</span>}
      </div>
    </div>
  );
}

function Admin() {
  const [auth, setAuth] = useState(null);
  const [apps, setApps] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [st, setSt] = useState("");
  const [sel, setSel] = useState(null);

  const check = () =>
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setAuth(d.authenticated))
      .catch(() => setAuth(false));
  useEffect(() => {
    check();
  }, []);
  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    fetch("/api/admin/applications")
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (r.status === 401) setAuth(false);
        else if (!r.ok) setErr(d.error || "Failed to load");
        else setApps(d.applications);
      })
      .finally(() => setLoading(false));
  }, [auth]);

  const filtered = useMemo(
    () =>
      apps.filter(
        (a) =>
          (!cat || (Array.isArray(a.category) ? a.category : [a.category]).includes(cat)) &&
          (!st || a.status === st) &&
          (!q ||
            [a.full_name, a.email, a.phone, a.reference_no, a.city]
              .join(" ")
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [apps, q, cat, st],
  );
  const selected = apps.find((a) => a.id === sel);

  if (auth === null)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-gold" />
      </div>
    );
  if (!auth) return <Login onDone={() => setAuth(true)} />;

  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([toCsv(filtered)], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "applications.csv" }).click();
    URL.revokeObjectURL(url);
  };
  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setApps([]);
    setAuth(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <Logo />
        <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </header>
      {err && (
        <p className="mb-4 rounded-lg border border-destructive/50 p-3 text-sm text-destructive">
          {err}
        </p>
      )}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
        <div className="col-span-2 rounded-xl border border-gold/50 bg-card p-4">
          <div className="text-3xl font-bold text-gold">{apps.length}</div>
          <div className="text-xs text-muted-foreground">Total applications</div>
        </div>
        {CATEGORIES.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-3">
            <div className="text-xl font-bold">
              {apps.filter((a) => {
                  const cats = Array.isArray(a.category) ? a.category : [a.category];
                  return cats.includes(c.id);
                }).length}
            </div>
            <div className="text-[11px] leading-tight text-muted-foreground">
              {c.name.replace(" Award", "")}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {STATUSES.map((s) => {
          const c = STATUS_COLOURS[s] ?? {};
          return (
            <div key={s} className="rounded-xl border border-border bg-card p-3 text-center">
              <div className="text-xl font-bold" style={{ color: c.text }}>
                {apps.filter((a) => a.status === s).length}
              </div>
              <div className="text-[11px] text-muted-foreground">{s}</div>
            </div>
          );
        })}
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          className="field max-w-xs"
          placeholder="Search name, email, phone, ref…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="field max-w-xs" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="field max-w-[12rem]" value={st} onChange={(e) => setSt(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 rounded-full border border-gold/60 px-4 text-sm text-gold"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>
      {(q || cat || st) && (
        <p className="mb-2 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
          {apps.length} applications
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_26rem]">
        <div className="overflow-x-auto rounded-xl border border-border">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="mx-auto animate-spin text-gold" />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-3">Ref</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSel(a.id)}
                    className={`cursor-pointer border-t border-border hover:bg-accent ${sel === a.id ? "bg-accent" : ""}`}
                  >
                    <td className="p-3 text-gold">{a.reference_no}</td>
                    <td className="p-3">{a.full_name}</td>
                    <td className="p-3">{(Array.isArray(a.category) ? a.category : [a.category]).map((id) => categoryById(id)?.name).filter(Boolean).join(", ")}</td>
                    <td className="p-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="p-3">{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div>
          {selected ? (
            <Detail
              app={selected}
              onSaved={(u) => setApps(apps.map((a) => (a.id === u.id ? u : a)))}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Select an application to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
