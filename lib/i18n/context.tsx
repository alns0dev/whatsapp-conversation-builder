"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "./types";
import type { Locale } from "./index";

type DictionaryContextValue = {
  t: Dictionary;
  lang: Locale;
};

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({
  dictionary,
  lang,
  children,
}: {
  dictionary: Dictionary;
  lang: Locale;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={{ t: dictionary, lang }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useTranslation(): DictionaryContextValue {
  const ctx = useContext(DictionaryContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a DictionaryProvider");
  }
  return ctx;
}
