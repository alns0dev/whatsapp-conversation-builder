"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import html2canvas from "html2canvas-pro";
import {
  ArrowDownToLine,
  ArrowUp,
  ArrowDown,
  Camera,
  Check,
  ChevronLeft,
  CirclePlus,
  Image as ImageIcon,
  Mic,
  Phone,
  Plus,
  Smile,
  Sticker,
  Trash2,
  Upload,
  Video,
} from "lucide-react";

import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

type Participant = {
  id: string;
  name: string;
  avatar: string;
  avatarUrl: string;
  accent: string;
};

type Message = {
  id: string;
  senderId: string;
  kind: "text" | "image";
  text: string;
  imageUrl: string;
  time: string;
};

const initialParticipants: Participant[] = [
  {
    id: "contact",
    name: "Valeria",
    avatar: "V",
    avatarUrl: "",
    accent: "from-emerald-400 to-green-500",
  },
  {
    id: "brand",
    name: "Casa Bruma",
    avatar: "C",
    avatarUrl: "",
    accent: "from-lime-400 to-emerald-500",
  },
];

const IMAGE_URL =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80";

function buildInitialMessages(
  msgs: { senderId: string; kind: string; text: string; time: string }[],
): Message[] {
  return msgs.map((m) => ({
    id: crypto.randomUUID(),
    senderId: m.senderId,
    kind: m.kind as Message["kind"],
    text: m.text,
    imageUrl: m.kind === "image" ? IMAGE_URL : "",
    time: m.time,
  }));
}

type Wallpaper = {
  id: string;
  label: string;
  bg: string;
  gradient: string;
  swatch: string;
  overlay?: string;
  imageUrl?: string;
};

const WA_DOODLE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.07'%3E%3Ccircle cx='20' cy='20' r='6'/%3E%3Crect x='60' y='10' width='12' height='10' rx='2'/%3E%3Cpath d='M110 15 l6 10 l-12 0z'/%3E%3Cellipse cx='160' cy='18' rx='8' ry='5'/%3E%3Cpath d='M15 70 Q25 55 35 70'/%3E%3Crect x='70' y='62' width='10' height='14' rx='2'/%3E%3Ccircle cx='120' cy='70' r='7'/%3E%3Cpath d='M165 60 l8 8 l-8 8 l-8-8z'/%3E%3Cpath d='M25 120 l10 0 l0 10 l-10 0z'/%3E%3Ccircle cx='75' cy='125' r='5'/%3E%3Cpath d='M115 115 Q125 130 135 115'/%3E%3Crect x='160' y='118' width='14' height='8' rx='3'/%3E%3Cellipse cx='30' cy='175' rx='6' ry='8'/%3E%3Cpath d='M70 170 l12 0 l-6 12z'/%3E%3Ccircle cx='125' cy='178' r='6'/%3E%3Cpath d='M160 170 Q170 160 180 170 Q170 180 160 170'/%3E%3C/g%3E%3C/svg%3E")`;

const wallpapers: Wallpaper[] = [
  {
    id: "dark-teal",
    label: "Teal",
    bg: "#0b1a19",
    swatch: "linear-gradient(135deg, #0d3b30, #1a5b49, #0b1a19)",
    gradient:
      "radial-gradient(circle at 20% 10%, rgba(21,91,73,0.5), transparent 45%), radial-gradient(circle at 85% 90%, rgba(26,35,58,0.5), transparent 45%), linear-gradient(180deg, #0b111a 0%, #0a0f18 100%)",
  },
  {
    id: "dark-teal-doodle",
    label: "Teal Doodle",
    bg: "#0b1a19",
    swatch: "linear-gradient(135deg, #0d3b30, #1a5b49, #0b1a19)",
    gradient:
      "radial-gradient(circle at 20% 10%, rgba(21,91,73,0.5), transparent 45%), radial-gradient(circle at 85% 90%, rgba(26,35,58,0.5), transparent 45%), linear-gradient(180deg, #0b111a 0%, #0a0f18 100%)",
    overlay: WA_DOODLE_SVG,
  },
  {
    id: "dark-green",
    label: "Verde",
    bg: "#0d1a11",
    swatch: "linear-gradient(135deg, #0f3d1e, #145028, #0d1a11)",
    gradient:
      "radial-gradient(circle at 30% 20%, rgba(20,80,40,0.5), transparent 45%), radial-gradient(circle at 80% 80%, rgba(15,40,30,0.5), transparent 45%), linear-gradient(180deg, #0a1210 0%, #0b0f0d 100%)",
  },
  {
    id: "dark-navy",
    label: "Navy",
    bg: "#0c1020",
    swatch: "linear-gradient(135deg, #1a2550, #1e325a, #0c1020)",
    gradient:
      "radial-gradient(circle at 25% 15%, rgba(30,50,90,0.5), transparent 45%), radial-gradient(circle at 75% 85%, rgba(20,30,60,0.5), transparent 45%), linear-gradient(180deg, #0b0f1a 0%, #090d18 100%)",
  },
  {
    id: "dark-navy-doodle",
    label: "Navy Doodle",
    bg: "#0c1020",
    swatch: "linear-gradient(135deg, #1a2550, #1e325a, #0c1020)",
    gradient:
      "radial-gradient(circle at 25% 15%, rgba(30,50,90,0.5), transparent 45%), radial-gradient(circle at 75% 85%, rgba(20,30,60,0.5), transparent 45%), linear-gradient(180deg, #0b0f1a 0%, #090d18 100%)",
    overlay: WA_DOODLE_SVG,
  },
  {
    id: "custom-image",
    label: "Custom Image",
    bg: "#0b1a19",
    swatch: "linear-gradient(135deg, #8b5cf6, #ec4899, #f97316)",
    gradient: "none",
  },
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadFromStorage(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage full or unavailable
  }
}

function removeFromStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export default function Home() {
  const { t, lang } = useTranslation();
  const dateLocale = lang === "en" ? enUS : es;

  const [participants, setParticipants] = useState(initialParticipants);
  const [messages, setMessages] = useState(() => buildInitialMessages(t.initialMessages));
  const [chatStatus, setChatStatus] = useState("tap here for contact info");
  const [statusBarTime, setStatusBarTime] = useState("4:46");
  const [chatDate, setChatDate] = useState<Date>(new Date(2025, 1, 13));
  const [wallpaper, setWallpaper] = useState(wallpapers[0].id);
  const [inputValue, setInputValue] = useState("");
  const [selectedSenderId, setSelectedSenderId] = useState(
    initialParticipants[1].id,
  );
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const phoneRef = useRef<HTMLDivElement>(null);

  // Hydrate uploaded images from localStorage on mount
  useEffect(() => {
    setParticipants((current) =>
      current.map((p) => ({
        ...p,
        avatarUrl: loadFromStorage(`wa-avatar-${p.id}`, p.avatarUrl),
      })),
    );
    setCustomWallpaperUrl(loadFromStorage("wa-wallpaper-custom", ""));
  }, []);

  const handleImageUpload = useCallback(
    async (file: File, storageKey: string): Promise<string> => {
      const dataUrl = await readFileAsDataUrl(file);
      saveToStorage(storageKey, dataUrl);
      return dataUrl;
    },
    [],
  );

  const activeWallpaper =
    wallpapers.find((entry) => entry.id === wallpaper) ?? wallpapers[0];

  const contact = participants[0] ?? initialParticipants[0];
  const brand = participants[1] ?? initialParticipants[1];

  const participantLookup = useMemo(
    () =>
      Object.fromEntries(
        participants.map((participant) => [participant.id, participant]),
      ),
    [participants],
  );

  function updateParticipant(
    id: string,
    field: keyof Participant,
    value: string,
  ) {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === id
          ? { ...participant, [field]: value }
          : participant,
      ),
    );
  }

  function updateMessage(id: string, field: keyof Message, value: string) {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, [field]: value } : message,
      ),
    );
  }

  function addMessage(kind: Message["kind"]) {
    const fallbackTime = messages.at(-1)?.time ?? "9:44";

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        senderId: selectedSenderId,
        kind,
        text: kind === "text" ? inputValue || t.defaults.newMessage : t.defaults.newImage,
        imageUrl:
          kind === "image"
            ? "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"
            : "",
        time: fallbackTime,
      },
    ]);

    setInputValue("");
  }

  function removeMessage(id: string) {
    setMessages((current) => current.filter((message) => message.id !== id));
  }

  function moveMessage(id: string, direction: -1 | 1) {
    setMessages((current) => {
      const index = current.findIndex((message) => message.id === id);
      const targetIndex = index + direction;

      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  }

  async function exportScreenshot() {
    if (!phoneRef.current) {
      return;
    }

    startTransition(async () => {
      const canvas = await html2canvas(phoneRef.current!, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${contact.name.toLowerCase().replace(/\s+/g, "-") || "whatsapp-screen"}.png`;
      link.click();
    });
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-8 px-4 py-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                {t.hero.title}
              </h1>
              <p className="text-sm text-slate-600 md:text-base">
                {t.hero.subtitle}
              </p>
            </div>
            <Button
              size="lg"
              className="bg-slate-950 px-4 text-white hover:bg-slate-800"
              onClick={exportScreenshot}
              disabled={isPending}
            >
              <ArrowDownToLine className="size-4" />
              {isPending ? t.hero.exporting : t.hero.exportBtn}
            </Button>
          </div>
        </section>

        <section className="grid flex-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,520px)]">
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    {t.scene.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {t.scene.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Field label={t.scene.clock}>
                  <input
                    value={statusBarTime}
                    maxLength={5}
                    onChange={(event) => {
                      const raw = event.target.value.replace(/[^\d:]/g, "");
                      if (raw.length <= 5) setStatusBarTime(raw);
                    }}
                    className={inputClasses}
                    placeholder="4:46"
                  />
                </Field>
                <Field label={t.scene.chatDate}>
                  <Popover>
                    <PopoverTrigger
                      className={cn(
                        inputClasses,
                        "flex items-center gap-2 text-left",
                      )}
                    >
                      <CalendarIcon className="size-4 shrink-0 text-slate-400" />
                      {format(chatDate, "EEE d MMM", { locale: dateLocale })}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={chatDate}
                        onSelect={(day) => day && setChatDate(day)}
                        locale={dateLocale}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
                <Field label={t.scene.headerStatus}>
                  <input
                    value={chatStatus}
                    onChange={(event) => setChatStatus(event.target.value)}
                    className={inputClasses}
                    placeholder="en línea"
                  />
                </Field>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <Avatar participant={participant} size="size-10" />
                      <p className="text-sm font-semibold text-slate-900">
                        {participant.id === contact.id ? t.scene.contact : t.scene.brand}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Field label={t.scene.name}>
                        <input
                          value={participant.name}
                          onChange={(event) =>
                            updateParticipant(
                              participant.id,
                              "name",
                              event.target.value,
                            )
                          }
                          className={inputClasses}
                        />
                      </Field>
                      <Field label={t.scene.avatarLetter}>
                        <input
                          value={participant.avatar}
                          onChange={(event) =>
                            updateParticipant(
                              participant.id,
                              "avatar",
                              event.target.value.slice(0, 2),
                            )
                          }
                          className={inputClasses}
                        />
                      </Field>
                      <Field label={t.scene.avatarImage}>
                        <div className="flex gap-2">
                          <input
                            value={participant.avatarUrl}
                            onChange={(event) => {
                              updateParticipant(
                                participant.id,
                                "avatarUrl",
                                event.target.value,
                              );
                              saveToStorage(
                                `wa-avatar-${participant.id}`,
                                event.target.value,
                              );
                            }}
                            className={cn(inputClasses, "min-w-0 flex-1")}
                            placeholder="https://..."
                          />
                          <label className={cn(inputClasses, "flex w-auto shrink-0 cursor-pointer items-center gap-1.5 px-3")}>
                            <Upload className="size-3.5" />
                            <span>{t.scene.upload}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                const dataUrl = await handleImageUpload(
                                  file,
                                  `wa-avatar-${participant.id}`,
                                );
                                updateParticipant(
                                  participant.id,
                                  "avatarUrl",
                                  dataUrl,
                                );
                                event.target.value = "";
                              }}
                            />
                          </label>
                          {participant.avatarUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                updateParticipant(
                                  participant.id,
                                  "avatarUrl",
                                  "",
                                );
                                removeFromStorage(
                                  `wa-avatar-${participant.id}`,
                                );
                              }}
                              className="flex shrink-0 items-center rounded-2xl border border-rose-200 bg-rose-50 px-2.5 text-rose-600 transition hover:bg-rose-100"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </Field>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-sm font-medium text-slate-800">{t.scene.wallpaper}</p>
                <div className="flex flex-wrap gap-3">
                  {wallpapers.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setWallpaper(entry.id)}
                      className={cn(
                        "group flex min-w-28 items-center gap-3 rounded-full border px-3 py-2 text-sm transition",
                        wallpaper === entry.id
                          ? "border-cyan-300 bg-cyan-50 text-cyan-800"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                      )}
                    >
                      <span
                        className="size-7 rounded-full shadow-inner"
                        style={{ background: entry.swatch }}
                      />
                      {entry.label}
                    </button>
                  ))}
                </div>
                {wallpaper === "custom-image" && (
                  <Field label={t.scene.backgroundImage}>
                    <div className="flex gap-2">
                      <input
                        value={customWallpaperUrl}
                        onChange={(event) => {
                          setCustomWallpaperUrl(event.target.value);
                          saveToStorage(
                            "wa-wallpaper-custom",
                            event.target.value,
                          );
                        }}
                        className={cn(inputClasses, "min-w-0 flex-1")}
                        placeholder="https://..."
                      />
                      <label className={cn(inputClasses, "flex w-auto shrink-0 cursor-pointer items-center gap-1.5 px-3")}>
                        <Upload className="size-3.5" />
                        <span>{t.scene.upload}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            const dataUrl = await handleImageUpload(
                              file,
                              "wa-wallpaper-custom",
                            );
                            setCustomWallpaperUrl(dataUrl);
                            event.target.value = "";
                          }}
                        />
                      </label>
                      {customWallpaperUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomWallpaperUrl("");
                            removeFromStorage("wa-wallpaper-custom");
                          }}
                          className="flex shrink-0 items-center rounded-2xl border border-rose-200 bg-rose-50 px-2.5 text-rose-600 transition hover:bg-rose-100"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </Field>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    {t.composer.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {t.composer.subtitle}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="border-slate-300 bg-white text-slate-900"
                    onClick={() => addMessage("text")}
                  >
                    <Plus className="size-4" />
                    {t.composer.addText}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-300 bg-white text-slate-900"
                    onClick={() => addMessage("image")}
                  >
                    <ImageIcon className="size-4" />
                    {t.composer.addImage}
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <Field label={t.composer.sender}>
                  <select
                    value={selectedSenderId}
                    onChange={(event) =>
                      setSelectedSenderId(event.target.value)
                    }
                    className={inputClasses}
                  >
                    {participants.map((participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t.composer.quickTextDraft}>
                  <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    className={inputClasses}
                    placeholder={t.composer.quickTextPlaceholder}
                  />
                </Field>
              </div>

              <div className="mt-6 space-y-4">
                {messages.map((message, index) => {
                  const sender = participantLookup[message.senderId] ?? brand;
                  const isBrand = sender.id === brand.id;

                  return (
                    <article
                      key={message.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar participant={sender} size="size-11" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-900">
                                {sender.name}
                              </p>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[11px] font-medium",
                                  isBrand
                                    ? "bg-[#dcf8c7] text-emerald-800"
                                    : "bg-slate-200 text-slate-700",
                                )}
                              >
                                {isBrand ? t.composer.outgoing : t.composer.incoming}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {t.composer.message} {index + 1}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            className="border-slate-300 bg-white text-slate-700"
                            onClick={() => moveMessage(message.id, -1)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            className="border-slate-300 bg-white text-slate-700"
                            onClick={() => moveMessage(message.id, 1)}
                            disabled={index === messages.length - 1}
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            className="border-slate-300 bg-white text-slate-700"
                            onClick={() =>
                              updateMessage(
                                message.id,
                                "senderId",
                                message.senderId === brand.id
                                  ? contact.id
                                  : brand.id,
                              )
                            }
                          >
                            <CirclePlus className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            className="border-rose-200 bg-rose-50 text-rose-700"
                            onClick={() => removeMessage(message.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-[130px_minmax(0,1fr)] xl:grid-cols-[130px_minmax(0,1fr)_220px]">
                        <Field label={t.composer.time}>
                          <input
                            value={message.time}
                            onChange={(event) =>
                              updateMessage(
                                message.id,
                                "time",
                                event.target.value,
                              )
                            }
                            className={inputClasses}
                          />
                        </Field>
                        <Field label={t.composer.messageText}>
                          <textarea
                            value={message.text}
                            onChange={(event) =>
                              updateMessage(
                                message.id,
                                "text",
                                event.target.value,
                              )
                            }
                            className={cn(
                              inputClasses,
                              "min-h-28 resize-y py-3",
                            )}
                          />
                        </Field>
                        <Field label={t.composer.imageUrl}>
                          <input
                            value={message.imageUrl}
                            onChange={(event) =>
                              updateMessage(
                                message.id,
                                "imageUrl",
                                event.target.value,
                              )
                            }
                            className={inputClasses}
                            placeholder="https://..."
                            disabled={message.kind !== "image"}
                          />
                        </Field>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {t.preview.label}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    {t.preview.title}
                  </h2>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                  430 x 932
                </div>
              </div>

              <div className="mt-5 flex flex-1 items-center justify-center">
                <div
                  ref={phoneRef}
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  className="relative w-full max-w-[430px] overflow-hidden rounded-[58px] border-[11px] border-[#0f1118] bg-[#0a0d14] p-[7px] shadow-[0_45px_120px_-50px_rgba(0,0,0,1)]"
                >
                  <div className="absolute -left-[3px] top-32 z-40 h-16 w-[3px] rounded-r-full bg-slate-700/70" />
                  <div className="absolute -left-[3px] top-52 z-40 h-24 w-[3px] rounded-r-full bg-slate-700/70" />
                  <div className="absolute -right-[3px] top-44 z-40 h-24 w-[3px] rounded-l-full bg-slate-700/70" />
                  <div className="absolute inset-x-[7px] top-[7px] z-30 rounded-t-[46px] bg-[#1b242d] px-8 pb-1 pt-3">
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span className="text-[17px] tracking-[-0.01em]">
                        {statusBarTime}
                      </span>
                      <div className="relative mx-auto h-[30px] w-[120px] rounded-full bg-[#05070c] shadow-[inset_0_-2px_6px_rgba(255,255,255,0.1)]" />
                      <div className="flex items-center gap-2 text-xs font-semibold text-white">
                        <div className="flex items-end gap-[2px]">
                          {[8, 11, 14, 17].map((height) => (
                            <span
                              key={height}
                              className="block w-[3px] rounded-full bg-white"
                              style={{ height }}
                            />
                          ))}
                        </div>
                        <svg
                          width="15"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M12 20h.01" />
                          <path d="M2 8.82a15 15 0 0 1 20 0" />
                          <path d="M5 12.859a10 10 0 0 1 14 0" />
                          <path d="M8.5 16.429a5 5 0 0 1 7 0" />
                        </svg>
                        <div className="relative">
                          <svg
                            width="28"
                            height="13"
                            viewBox="0 0 28 13"
                            fill="none"
                            aria-hidden
                          >
                            <rect
                              x="0.5"
                              y="0.5"
                              width="23"
                              height="12"
                              rx="2.5"
                              stroke="white"
                              strokeOpacity="0.35"
                            />
                            <rect
                              x="2"
                              y="2"
                              width="18"
                              height="9"
                              rx="1.5"
                              fill="white"
                            />
                            <path
                              d="M25 4.5V8.5C25.8 8.1 25.8 4.9 25 4.5Z"
                              fill="white"
                              fillOpacity="0.4"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center pr-[5px] text-[9px] font-semibold leading-none text-[#0f1118]">
                            92
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="relative aspect-[430/932] overflow-hidden rounded-[46px] text-slate-900"
                    style={{ backgroundColor: activeWallpaper.bg }}
                  >
                    {activeWallpaper.id === "custom-image" &&
                    customWallpaperUrl ? (
                      <img
                        src={customWallpaperUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <>
                        <div
                          className="absolute inset-0"
                          style={{ background: activeWallpaper.gradient }}
                        />
                        {activeWallpaper.overlay && (
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage: activeWallpaper.overlay,
                              backgroundRepeat: "repeat",
                            }}
                          />
                        )}
                      </>
                    )}
                    <div
                      className="absolute inset-0 opacity-[0.23]"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.24) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 30%, rgba(120,120,120,0.16) 0 1px, transparent 1.5px), radial-gradient(circle at 30% 75%, rgba(255,255,255,0.18) 0 1px, transparent 1.5px), radial-gradient(circle at 80% 70%, rgba(120,120,120,0.16) 0 1px, transparent 1.5px)",
                        backgroundSize:
                          "88px 88px, 76px 76px, 102px 102px, 90px 90px",
                      }}
                    />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="rounded-b-[18px] bg-[#1b242d] pb-2.5 pt-12 shadow-[0_14px_40px_-30px_rgba(0,0,0,0.55)]">
                        <div className="flex items-center gap-2 px-3 text-white/95">
                          <div className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/5">
                            <ChevronLeft className="size-5" />
                          </div>
                          <Avatar
                            participant={contact}
                            size="size-11"
                            className="border border-white/25"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[17px] font-semibold tracking-[-0.02em] text-white">
                              {contact.name}
                            </p>
                            <p className="truncate text-[13px] text-white/65">
                              {chatStatus}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-3 py-2">
                            <Video className="size-5" />
                            <Phone className="size-5" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 overflow-hidden px-3 pb-3 pt-3">
                        <div className="flex justify-center">
                          <span className="text-[12px] font-semibold text-white/80">
                            {format(chatDate, "EEE d MMM", { locale: dateLocale })}
                          </span>
                        </div>
                        {messages.map((message, index) => {
                          const sender =
                            participantLookup[message.senderId] ?? brand;
                          const isBrand = sender.id === brand.id;

                          return (
                            <div
                              key={message.id}
                              className={cn(
                                "flex",
                                isBrand ? "justify-end" : "justify-start",
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[82%] rounded-[18px] px-3 py-2 shadow-[0_12px_20px_-16px_rgba(0,0,0,0.75)]",
                                  isBrand
                                    ? "rounded-br-[6px] bg-[#0c6d50]"
                                    : "rounded-bl-[6px] bg-[#1f2832]",
                                )}
                              >
                                {message.kind === "image" &&
                                message.imageUrl ? (
                                  <div className="overflow-hidden rounded-[12px] bg-slate-200">
                                    <img
                                      src={message.imageUrl}
                                      alt="Message attachment"
                                      className="h-40 w-full object-cover"
                                    />
                                  </div>
                                ) : null}
                                {message.text ? (
                                  <p className="mt-1 whitespace-pre-wrap text-[15px] leading-[1.34] text-white">
                                    {message.text}
                                  </p>
                                ) : null}
                                <div className="mt-1 flex items-center justify-end gap-1 text-[12px] text-white/55">
                                  <span>{message.time}</span>
                                  {isBrand ? (
                                    <span className="flex items-center text-[#a4d7ef]">
                                      <Check className="size-3.5 -mr-2.5" />
                                      <Check className="size-3.5" />
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-[#1b242d]/90 px-3 pb-4 pt-3 backdrop-blur-3xl">
                        <div className="flex items-center gap-2">
                          <CirclePlus className="size-8 text-white/80" />
                          <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-[#2a2e34] px-4 text-[14px]">
                            <div className="flex-1" />
                            <svg
                              className="size-5"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="white"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14.1667 0H5.83333C4.28674 0.0016544 2.80397 0.616767 1.71037 1.71037C0.616767 2.80397 0.0016544 4.28674 0 5.83333V14.1667C0.0016544 15.7133 0.616767 17.196 1.71037 18.2896C2.80397 19.3832 4.28674 19.9983 5.83333 20H10.8333C10.9229 20 11.0119 19.9856 11.0969 19.9573C13.8292 19.0458 19.0458 13.8292 19.9573 11.0969C19.9856 11.0119 20 10.9229 20 10.8333V5.83333C19.9983 4.28674 19.3832 2.80397 18.2896 1.71037C17.196 0.616767 15.7133 0.0016544 14.1667 0ZM1.66667 14.1667V5.83333C1.66667 4.72826 2.10565 3.66846 2.88706 2.88706C3.66846 2.10565 4.72826 1.66667 5.83333 1.66667H14.1667C15.2717 1.66667 16.3315 2.10565 17.1129 2.88706C17.8943 3.66846 18.3333 4.72826 18.3333 5.83333V10H15.8333C14.2867 10.0017 12.804 10.6168 11.7104 11.7104C10.6168 12.804 10.0017 14.2867 10 15.8333V18.3333H5.83333C4.72826 18.3333 3.66846 17.8943 2.88706 17.1129C2.10565 16.3315 1.66667 15.2717 1.66667 14.1667ZM11.6667 17.8271V15.8333C11.6667 14.7283 12.1057 13.6685 12.8871 12.8871C13.6685 12.1057 14.7283 11.6667 15.8333 11.6667H17.8271C16.5625 13.6979 13.6979 16.5625 11.6667 17.8271Z"
                                fill="#CFD0D3"
                              />
                            </svg>
                          </div>
                          <Camera className="size-6 text-white/80" />
                          <Mic className="size-6 text-white/80" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function Avatar({
  participant,
  size,
  className,
}: {
  participant: Participant;
  size: string;
  className?: string;
}) {
  if (participant.avatarUrl) {
    return (
      <img
        src={participant.avatarUrl}
        alt={participant.name}
        className={cn(
          "rounded-full object-cover",
          size,
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white",
        size,
        participant.accent,
        className,
      )}
    >
      {participant.avatar.slice(0, 1) ||
        participant.name.slice(0, 1) ||
        "?"}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClasses =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200/50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";
