"use client";

import { useTranslation } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
        <p className="text-center text-xs text-slate-500">
          {t.footer.disclaimer}
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          &copy; {year} {t.footer.copyright} &middot; Made by{" "}
          <a
            href="https://x.com/alns0_"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition hover:text-slate-600"
          >
            alns0
          </a>
        </p>
      </div>
    </footer>
  );
}
