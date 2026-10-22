export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-hero">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-16 text-center md:pt-24">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">
          Organized by Super AI Academy
        </p>
        <h1 className="fade-up text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Social media <span className="text-gold-gradient">superhero contest winners</span> 2026
        </h1>
        <p className="mt-5 text-lg text-gold-soft md:text-xl">
          Celebrate Creativity. Recognize Innovation. Reward Excellence.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Your creativity deserves recognition. Showcase your best work from the Social Media
          Superhero Challenge 2026 and apply for an award.
        </p>
        <div className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-4">
          {[
            ["09", "Award Categories"],
            ["150", "Total Winners"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-xl border border-border bg-card/60 p-5">
              <div className="font-display text-4xl font-bold text-gold-gradient">{n}</div>
              <div className="mt-1 text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="#apply"
            className="rounded-full bg-gold-gradient px-7 py-3 font-semibold text-primary-foreground shadow-gold"
          >
            Apply for an Award
          </a>
          <a
            href="#categories"
            className="rounded-full border border-gold/60 px-7 py-3 font-semibold text-gold hover:bg-gold/10"
          >
            Explore Award Categories
          </a>
        </div>
      </div>
    </section>
  );
}
