import logo from "@/assets/logo.png";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt="Super AI Academy logo" className="h-9 w-9 rounded-lg" />
      <span className="font-display text-sm font-semibold tracking-wider">SUPER AI ACADEMY</span>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top"><Logo /></a>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <a href="#categories" className="hover:text-gold">Categories</a>
          <a href="#how" className="hover:text-gold">How to Apply</a>
          <a href="#faq" className="hover:text-gold">FAQ</a>
        </nav>
        <a href="#apply" className="rounded-full bg-gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground">Apply</a>
      </div>
    </header>
  );
}
