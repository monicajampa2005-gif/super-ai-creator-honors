import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { ApplicationForm } from "@/components/ApplicationForm";
import { HowToApply, Faq, Footer } from "@/components/InfoSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Super AI Creator Excellence Awards 2026 | Apply Now" },
      { name: "description", content: "Apply for one of nine award categories with 150 winners. Organized by Super AI Academy." },
      { property: "og:title", content: "Super AI Creator Excellence Awards 2026" },
      { property: "og:description", content: "Celebrate Creativity. Recognize Innovation. Reward Excellence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [category, setCategory] = useState("");
  const applyFor = (id) => {
    setCategory(id);
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Categories onApply={applyFor} />
        <HowToApply />
        <section id="apply" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16">
          <h2 className="mb-2 text-center text-3xl font-bold">Apply for an <span className="text-gold-gradient">Award</span></h2>
          <p className="mb-8 text-center text-muted-foreground">All nine sections are required.</p>
          <ApplicationForm category={category} setCategory={setCategory} />
        </section>
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
