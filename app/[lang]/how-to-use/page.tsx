"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { Settings, MessageSquarePlus, Palette, Download, ArrowLeft } from "lucide-react";

const stepIcons = [Settings, MessageSquarePlus, Palette, Download];

export default function HowToUsePage() {
  const { t, lang } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          {t.howToUse.title}
        </h1>
        <p className="mt-3 text-slate-600">{t.howToUse.subtitle}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {t.howToUse.steps.map((step, index) => {
          const Icon = stepIcons[index];
          return (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <Icon className="size-5" />
                </div>
                <span className="text-sm font-bold text-slate-400">
                  {index + 1}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-slate-950">
                {step.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
        >
          <ArrowLeft className="size-4" />
          {t.howToUse.backToBuilder}
        </Link>
      </div>
    </div>
  );
}
