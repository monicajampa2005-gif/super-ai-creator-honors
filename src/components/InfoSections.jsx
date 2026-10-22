import { Instagram, Youtube } from "lucide-react";
import { Logo } from "./Header";

// WhatsApp brand glyph (lucide has no brand icons)
function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const STEPS = [
  "Choose the award category that best fits your work.",
  "Collect your best 3 content links from the Social Media Superhero Challenge 2026.",
  "Prepare relevant screenshots and a clear photo of yourself.",
  "Fill in the nine-part form and submit. Save your reference number.",
];
const FAQ = [
  ["Who can apply?", "Creators who participated in the Social Media Superhero Challenge 2026."],
  [
    "Can I apply for more than one category?",
    "Each application is for one category. Choose the category that best represents your work.",
  ],
  ["Which image formats are accepted?", "JPG, JPEG, PNG and WEBP, up to 5 MB per file."],
  [
    "How will I know my application was received?",
    "You will see a confirmation with a unique reference number once it is saved.",
  ],
];

export function HowToApply() {
  return (
    <section id="how" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">
        How to <span className="text-gold-gradient">Apply</span>
      </h2>
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
      <div
        id="privacy"
        className="mt-10 rounded-xl border border-border p-5 text-sm text-muted-foreground"
      >
        <h3 className="mb-2 text-base font-semibold text-foreground">Privacy</h3>
        Your details, photo and screenshots are stored privately and are only accessible to
        authorised Super AI Academy reviewers for evaluating award applications.
      </div>
    </section>
  );
}

export function Footer() {
  const links = [
    ["Categories", "#categories"],
    ["How to Apply", "#how"],
    ["FAQ", "#faq"],
    ["Apply", "#apply"],
  ];
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Celebrate Creativity. Recognize Innovation. Reward Excellence.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://www.instagram.com/superaiofficial/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="text-muted-foreground transition-colors hover:text-gold"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@superaiacademyofficial"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="YouTube"
                className="text-muted-foreground transition-colors hover:text-gold"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb7BBky8KMqkGSrh8R1R"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="WhatsApp"
                className="text-muted-foreground transition-colors hover:text-gold"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <nav className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            {links.map(([label, href]) => (
              <a key={href} href={href} className="text-sm text-muted-foreground hover:text-gold">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">For Questions</h3>
            <p className="text-sm text-muted-foreground">Contact</p>
            <a href="tel:7331112687" className="text-sm text-gold hover:underline">
              7331112687
            </a>
            <a href="tel:7331112693" className="text-sm text-gold hover:underline">
              7331112693
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Super AI Academy · Super AI Creator Excellence Awards 2026</p>
        </div>
      </div>
    </footer>
  );
}
