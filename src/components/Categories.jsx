import { useState } from "react";
import { Award, Check } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export function Categories({ onApply }) {
  const [lang, setLang] = useState("en");
  return (
    <section id="categories" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Award <span className="text-gold-gradient">Categories</span></h2>
        <p className="text-muted-foreground">Nine categories · 150 winners</p>
        <div className="inline-flex rounded-full border border-border p-1 text-sm" role="group" aria-label="Language">
          {[["en", "English"], ["te", "తెలుగు"]].map(([k, l]) => (
            <button key={k} onClick={() => setLang(k)} aria-pressed={lang === k}
              className={`rounded-full px-4 py-1.5 ${lang === k ? "bg-gold-gradient text-primary-foreground" : "text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <article key={c.id} className="card-award flex flex-col p-6">
            <div className="mb-4 flex items-start justify-between">
              <Award className="h-8 w-8 text-gold" />
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">{c.winners} Winners</span>
            </div>
            <p className="text-xs text-muted-foreground">Category {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-lg font-semibold">{c.name}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{lang === "en" ? c.en : c.te}</p>
            <ul className="mt-4 space-y-1.5 text-sm">
              {c.criteria.map((k) => <li key={k} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{k}</li>)}
            </ul>
            <button onClick={() => onApply(c.id)} className="mt-6 rounded-full border border-gold/60 py-2 text-sm font-semibold text-gold hover:bg-gold/10">Apply</button>
          </article>
        ))}
      </div>
    </section>
  );
}
