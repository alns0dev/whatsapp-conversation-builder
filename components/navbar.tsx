"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { Globe } from "lucide-react";

export function Navbar() {
  const { t, lang } = useTranslation();
  const pathname = usePathname();

  function localeHref(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  }

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href={`/${lang}`}
            className="text-lg font-bold tracking-tight text-slate-950"
          >
            {t.nav.appName}
          </Link>
          <Link
            href={`/${lang}/how-to-use`}
            className="text-sm text-slate-600 transition hover:text-slate-900"
          >
            {t.nav.howToUse}
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <Globe className="mr-1 size-4 text-slate-500" />
          {(["es", "en"] as const).map((locale) => (
            <a
              key={locale}
              href={localeHref(locale)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium uppercase transition ${
                lang === locale
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {locale}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
