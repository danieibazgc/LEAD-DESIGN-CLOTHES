/**
 * Product Selection Dashboard — LEAD Design Clothes
 * Route: /studio
 */

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { GARMENTS } from "@/lib/data/garments";
import type { Garment } from "@/lib/types/domain";

type Category = "all" | "tops" | "bottoms" | "outerwear" | "accessories";

export default function StudioPage() {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo<Garment[]>(() => {
    return GARMENTS.filter((g) => {
      const matchesCat = category === "all" || g.category === category;
      const matchesSearch =
        search.trim() === "" ||
        g.name.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [category, search]);

  const categories: { id: Category; label: string }[] = [
    { id: "all", label: "All" },
    { id: "tops", label: "Tops" },
    { id: "bottoms", label: "Bottoms" },
    { id: "outerwear", label: "Outerwear" },
    { id: "accessories", label: "Accessories" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        title="Studio"
        subtitle="Catalog"
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs text-outline font-label">
              {GARMENTS.length} garments
            </span>
          </div>
        }
      />

      <div className="pt-16 flex min-h-screen">
        {/* ── Sidebar filters ── */}
        <aside className="w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto bg-surface-container-lowest border-r border-outline-variant/10 p-6 no-scrollbar">
          <h2 className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-4">
            Category
          </h2>
          <nav className="flex flex-col gap-1 mb-8">
            {categories.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === id
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <h2 className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-4">
            Print Areas
          </h2>
          <div className="flex flex-col gap-2 mb-8">
            {["1 area", "2 areas", "3+ areas"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                <span className="w-4 h-4 rounded border border-outline-variant group-hover:border-primary transition-colors" />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                  {opt}
                </span>
              </label>
            ))}
          </div>

          <h2 className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-4">
            Colors
          </h2>
          <div className="flex flex-wrap gap-2">
            {["#191c1e", "#FFFFFF", "#000080", "#d00000", "#4b5320", "#800020", "#9ca3af", "#c2b280"].map((hex) => (
              <button
                key={hex}
                style={{ backgroundColor: hex }}
                title={hex}
                className="w-6 h-6 rounded-full ring-1 ring-outline-variant/20 hover:ring-2 hover:ring-primary transition-all"
              />
            ))}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 p-8">
          {/* Search bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search garments…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-10 py-2.5 text-sm text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>
          </div>

          {/* Recently used */}
          <section className="mb-10">
            <h2 className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-4">
              Recently Used
            </h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {GARMENTS.slice(0, 3).map((g) => (
                <Link key={g.id} href={`/studio/${g.id}`}>
                  <div className="shrink-0 w-40 group cursor-pointer">
                    <div className="w-40 h-48 rounded-2xl bg-surface-container overflow-hidden relative ambient-shadow group-hover:scale-[1.03] transition-transform">
                      <Image
                        src={g.thumbnailUrl}
                        alt={g.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium text-on-surface-variant truncate">
                      {g.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* All garments */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-label font-bold text-outline uppercase tracking-widest">
                All Garments{" "}
                <span className="normal-case text-on-surface-variant font-normal">
                  ({filtered.length})
                </span>
              </h2>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-outline">
                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-outline-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-headline font-bold">No garments found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((g) => (
                  <GarmentCard key={g.id} garment={g} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function GarmentCard({ garment }: { garment: Garment }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-surface-container-lowest ambient-shadow"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[3/4] bg-surface-container overflow-hidden">
        <Image
          src={garment.thumbnailUrl}
          alt={garment.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />

        {/* Hover overlay */}
        {hovered && (
          <div className="absolute inset-0 bg-on-surface/40 flex items-center justify-center">
            <Link href={`/studio/${garment.id}`}>
              <Button variant="key-action" size="sm">
                Customize
              </Button>
            </Link>
          </div>
        )}

        {/* Print areas badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-surface-container-lowest/90 rounded-lg text-[10px] font-bold text-on-surface font-label uppercase">
          {garment.printAreas} areas
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-headline font-bold text-sm text-on-surface mb-2 truncate">
          {garment.name}
        </h3>
        {/* Color swatches */}
        <div className="flex gap-1.5 flex-wrap">
          {garment.colors.slice(0, 6).map((c) => (
            <span
              key={c.id}
              style={{ backgroundColor: c.hex }}
              title={c.name}
              className="w-4 h-4 rounded-full ring-1 ring-outline-variant/20"
            />
          ))}
          {garment.colors.length > 6 && (
            <span className="text-[10px] text-outline self-center">
              +{garment.colors.length - 6}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
