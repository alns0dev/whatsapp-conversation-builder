import type { Metadata } from "next";
import { getDictionary, isValidLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { DictionaryProvider } from "@/lib/i18n/context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "es";
  const dict = await getDictionary(locale);

  return {
    title: `${dict.nav.appName} - ${dict.hero.title}`,
    description: dict.hero.subtitle,
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : "es";
  const dictionary = await getDictionary(locale);

  return (
    <DictionaryProvider dictionary={dictionary} lang={locale}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </DictionaryProvider>
  );
}
