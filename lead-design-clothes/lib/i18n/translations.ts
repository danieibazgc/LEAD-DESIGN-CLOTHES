export const SUPPORTED_LOCALES = ["en", "es", "pt"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const localeOptions: { value: Locale; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];

export const translations = {
  en: {
    "topbar.studio": "Studio",
    "topbar.catalog": "Catalog",
    "topbar.review": "Review",
    "topbar.finalStep": "Final Step",
    "topbar.editor": "Editor",
    "language.label": "Language",
    "studio.garmentsCount": "{count} garments",
    "editor.quickExport": "Quick Export",
    "editor.reviewExport": "Review & Export",
    "review.backToEditor": "← Back to Editor",
    "review.export": "Export",
  },
  es: {
    "topbar.studio": "Estudio",
    "topbar.catalog": "Catálogo",
    "topbar.review": "Revisión",
    "topbar.finalStep": "Paso final",
    "topbar.editor": "Editor",
    "language.label": "Idioma",
    "studio.garmentsCount": "{count} prendas",
    "editor.quickExport": "Exportación rápida",
    "editor.reviewExport": "Revisar y exportar",
    "review.backToEditor": "← Volver al editor",
    "review.export": "Exportar",
  },
  pt: {
    "topbar.studio": "Estúdio",
    "topbar.catalog": "Catálogo",
    "topbar.review": "Revisão",
    "topbar.finalStep": "Etapa final",
    "topbar.editor": "Editor",
    "language.label": "Idioma",
    "studio.garmentsCount": "{count} peças",
    "editor.quickExport": "Exportação rápida",
    "editor.reviewExport": "Revisar e exportar",
    "review.backToEditor": "← Voltar ao editor",
    "review.export": "Exportar",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function formatTranslation(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
) {
  const template = translations[locale][key] ?? translations.en[key];

  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (_, token: string) =>
    String(params[token] ?? `{${token}}`)
  );
}
