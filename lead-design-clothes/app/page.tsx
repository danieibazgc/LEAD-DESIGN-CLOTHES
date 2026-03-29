/**
 * Landing Page — LEAD Design Clothes
 * Route: /
 */

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TopBar } from "@/components/ui/TopBar";

const FEATURES = [
  {
    icon: "cloud_upload",
    color: "bg-primary-fixed",
    iconColor: "text-primary",
    title: "Instant Upload",
    desc: "Drag and drop your AI, SVG, or high-res PNG designs directly into the workspace.",
  },
  {
    icon: "magic_button",
    color: "bg-tertiary-fixed",
    iconColor: "text-on-tertiary-fixed",
    title: "AI Background Removal",
    desc: "Automatically strip backgrounds from your graphics with a single click.",
  },
  {
    icon: "layers",
    color: "bg-secondary-fixed",
    iconColor: "text-secondary",
    title: "Precision Layers",
    desc: "Manage multiple print areas, labels, and hangtags in a non-destructive layer stack.",
  },
  {
    icon: "360",
    color: "bg-primary-fixed",
    iconColor: "text-primary",
    title: "Full Perspective",
    desc: "Toggle between front, back, and detail shots effortlessly for a complete product view.",
  },
  {
    icon: "auto_awesome",
    color: "bg-tertiary-fixed",
    iconColor: "text-on-tertiary-fixed",
    title: "AI Generation",
    desc: "Describe a pattern and let our generative AI create unique art for your apparel.",
  },
  {
    icon: "download",
    color: "bg-secondary-fixed",
    iconColor: "text-secondary",
    title: "4K Exports",
    desc: "Download ultra-high resolution renders ready for your web store or pitch decks.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Upload Design",
    desc: "Upload your artwork. Our AI automatically detects the best placement on the garment.",
  },
  {
    n: "2",
    title: "Customize Material",
    desc: "Select fabric types, colors, and textures. Adjust displacement maps for realism.",
  },
  {
    n: "3",
    title: "Export Renders",
    desc: "Render high-fidelity photorealistic images in multiple lighting environments.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      '"LEAD Design replaced our entire photography studio workflow. We can launch new collections in hours, not weeks."',
    name: "Sarah Jenkins",
    role: "Founder, Thread & Stone",
  },
  {
    quote:
      '"The AI fabric mapping is insane. It actually follows the folds and shadows of the shirt. Best tool I\'ve used."',
    name: "Marcus Wu",
    role: "Lead Designer, Veloce Labs",
  },
  {
    quote:
      '"Perfect for pre-selling. I use the 4K renders for my Shopify store before I even have the physical samples."',
    name: "Elena Rodriguez",
    role: "Director, Urban Stitch",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar
        actions={
          <Link href="/studio">
            <Button variant="primary" size="sm">
              Start Designing
            </Button>
          </Link>
        }
      />

      <main className="pt-16">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-24 pb-32 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <span className="inline-block py-1 px-3 mb-6 bg-tertiary-fixed text-on-tertiary-fixed font-label text-xs font-bold rounded-full tracking-wide">
                AI-POWERED DESIGN
              </span>
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter leading-tight mb-6 text-on-surface">
                Turn any design into a{" "}
                <span className="text-primary">realistic</span> apparel mockup
                in seconds
              </h1>
              <p className="text-xl text-outline mb-10 max-w-lg leading-relaxed">
                Elevate your brand with studio-quality renders. No Photoshop
                needed. Simply upload your artwork and let our AI handle the
                fabric mapping.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/studio">
                  <Button variant="primary" size="lg">
                    Start Designing
                  </Button>
                </Link>
                <Button variant="secondary" size="lg">
                  See Demo
                </Button>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-tertiary-fixed/20 blur-3xl rounded-full opacity-50" />
              <div className="relative bg-surface-container-lowest rounded-2xl ambient-shadow p-2">
                <div className="aspect-video bg-surface-container rounded-xl flex items-center justify-center canvas-dots">
                  <div className="text-center px-8">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <svg viewBox="0 0 48 48" className="w-10 h-10 text-primary fill-current">
                        <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm0 4c3.7 0 7.1 1.1 10 3l-3.5 3.5A11.9 11.9 0 0024 12c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12c0-2-.5-3.9-1.5-5.5L38 15a16 16 0 110-22z"/>
                      </svg>
                    </div>
                    <p className="font-headline font-bold text-on-surface-variant">
                      LEAD Design Studio
                    </p>
                    <p className="text-sm text-outline mt-1">Canvas Preview</p>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute bottom-8 -left-8 glass-panel p-4 rounded-2xl ambient-shadow hidden md:block">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse" />
                    <span className="font-headline font-bold text-xs">AI Fabric Mapping</span>
                  </div>
                  <div className="h-1.5 w-40 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%] rounded-full" />
                  </div>
                  <span className="text-[10px] text-outline mt-1.5 block font-label uppercase tracking-widest">
                    Optimizing… 85%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-32 px-6 bg-surface-container-low" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tight mb-4">
                Precision at every pixel
              </h2>
              <p className="text-outline max-w-2xl mx-auto">
                LEAD Design provides industry-standard tools for professional
                apparel visualization.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="p-8 rounded-2xl bg-surface-container-lowest hover:bg-surface-container transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-lg font-bold`}
                  >
                    <span className={`text-sm font-bold ${f.iconColor}`}>{f.icon.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-3">
                    {f.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Studio Workflow ── */}
        <section className="bg-surface py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-headline font-extrabold tracking-tight">
                Studio Workflow
              </h2>
              <p className="text-outline mt-4">
                From concept to production in minutes.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {STEPS.map((step, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-8 font-headline font-extrabold text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    {step.n}
                  </div>
                  <h4 className="text-xl font-headline font-bold mb-4">
                    {step.title}
                  </h4>
                  <p className="text-on-surface-variant text-sm px-4">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-32 px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-headline font-bold mb-2">
                Loved by 10,000+ brands
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="p-8 bg-surface-container-lowest rounded-2xl ambient-shadow"
                >
                  <p className="text-on-surface font-medium italic mb-6 leading-relaxed">
                    {t.quote}
                  </p>
                  <div>
                    <h5 className="font-headline font-bold text-sm">{t.name}</h5>
                    <p className="text-outline text-xs uppercase tracking-wider font-label">
                      {t.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-32 px-6 bg-primary text-on-primary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-headline font-extrabold tracking-tight mb-6">
              Ready to design your first piece?
            </h2>
            <p className="text-on-primary/70 mb-10 text-lg">
              No credit card required. Start with any garment template and
              produce studio-quality renders in seconds.
            </p>
            <Link href="/studio">
              <Button variant="key-action" size="lg">
                Start for Free
              </Button>
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-surface-container-lowest py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-headline font-extrabold text-lg tracking-tighter text-on-surface">
              LEAD Design Clothes
            </span>
            <span className="text-outline text-xs font-label uppercase tracking-widest">
              © 2026 LEAD Design Clothes. All rights reserved.
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
