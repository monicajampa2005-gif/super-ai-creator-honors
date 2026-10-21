import { Logo } from "./Header";

const STEPS = ["Choose the award category that best fits your work.", "Collect your best 3 content links from the Social Media Superhero Challenge 2026.", "Prepare relevant screenshots and a clear photo of yourself.", "Fill in the nine-part form and submit. Save your reference number."];
const FAQ = [
  ["Who can apply?", "Creators who participated in the Social Media Superhero Challenge 2026."],
  ["Can I apply for more than one category?", "Each application is for one category. Choose the category that best represents your work."],
  ["Which image formats are accepted?", "JPG, JPEG, PNG and WEBP, up to 5 MB per file."],
  ["How will I know my application was received?", "You will see a confirmation with a unique reference number once it is saved."],
];

export function HowToApply() {
  return (
    <section id="how" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">How to <span className="text-gold-gradient">Apply</span></h2>
      <ol className="grid gap-4 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={i} className="rounded-xl border border-border bg-card/50 p-5">
            <span className="font-display text-2xl text-gold">{i + 1}</span>
            <p className="mt-2 text-sm text-muted-foreground">{s}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">FAQ</h2>
      <div className="space-y-3">
        {FAQ.map(([q, a]) => (
          <details key={q} className="rounded-xl border border-border bg-card/50 p-4">
            <summary className="cursor-pointer font-semibold">{q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
      <div id="privacy" className="mt-10 rounded-xl border border-border p-5 text-sm text-muted-foreground">
        <h3 className="mb-2 text-base font-semibold text-foreground">Privacy</h3>
        Your details, photo and screenshots are stored privately and are only accessible to authorised Super AI Academy reviewers for evaluating award applications.
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row">
        <Logo />
        <p>© 2026 Super AI Academy · Super AI Creator Excellence Awards 2026</p>
      </div>
    </footer>
  );
}
