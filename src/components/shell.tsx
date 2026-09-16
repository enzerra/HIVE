"use client";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Bell,
  Menu,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Users,
  House,
  Swords,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Radio,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, Mark } from "./identity";
import { useSession } from "@/lib/client/session";
import { api, post } from "@/lib/client/api";
import type { OpenCall } from "@/domain/types";
import "./pulse-companion.css";
const nav = [
  ["/home", "Home"],
  ["/arena", "Arena"],
  ["/explore", "Hives"],
  ["/rankings", "Rankings"],
];
function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
const isScrolled = () => window.scrollY > 48;
const serverScroll = () => false;
export function Header() {
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    isScrolled,
    serverScroll,
  );
  const { data: viewer } = useSession(),
    path = usePathname(),
    router = useRouter(),
    qc = useQueryClient(),
    { resolvedTheme, setTheme } = useTheme();
  const links = viewer
    ? nav
    : [
        ["/explore", "Temukan Hive"],
        ["/#how-it-works", "Cara bermain"],
        ["/replays/founding-001", "Replay"],
      ];
  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="header-inner">
        <Link
          className="wordmark"
          href={viewer ? "/home" : "/"}
          aria-label="HIVE home"
        >
          <Mark />
          hive<span className="wordmark-dot">.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <span className="season-label">
            FOUNDING SEASON <span>DEMO</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ganti tema"
            onClick={async () => {
              const theme = resolvedTheme === "dark" ? "light" : "dark";
              setTheme(theme);
              if (viewer) {
                try {
                  await post("preferences", { theme });
                  qc.setQueryData(["session"], {
                    ...viewer,
                    preferences: { ...viewer.preferences, theme },
                  });
                } catch {
                  /* The local theme remains usable when the preference service is offline. */
                }
              }
            }}
          >
            <Sun className="hidden dark:block" size={17} />
            <Moon className="dark:hidden" size={17} />
          </Button>
          {viewer ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/notifications" aria-label="Notifikasi">
                  <Bell size={18} />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="account-trigger"
                    aria-label="Menu akun"
                  >
                    <Avatar index={viewer.avatar} size={30} />
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/humans/${viewer.handle}`}>
                      <User />
                      Profil saya
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        viewer.squadId
                          ? `/squads/${viewer.squadId}`
                          : "/onboarding/squad"
                      }
                    >
                      <Users />
                      Squad saya
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings />
                      Pengaturan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await api("auth/logout", { method: "POST" });
                      qc.clear();
                      router.push("/");
                      router.refresh();
                    }}
                  >
                    <LogOut />
                    Keluar dari demo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="join-header">
              <Link href="/sign-in">
                Gabung HIVE <ArrowUpRight size={16} />
              </Link>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="mobile-menu"
                variant="ghost"
                size="icon"
                aria-label="Buka navigasi"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="px-5 pt-7">
                <SheetTitle>Jelajahi HIVE</SheetTitle>
                <SheetDescription className="mt-2">
                  Komunitas, pertandingan, dan ruangmu.
                </SheetDescription>
              </div>
              <nav className="mobile-nav">
                {links.map(([href, label]) => (
                  <SheetClose key={href} asChild>
                    <Link href={href}>{label}</Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer content-width">
      <Link className="wordmark" href="/">
        <Mark size={22} />
        hive.
      </Link>
      <span>Good people. Different perspectives.</span>
      <div>
        <Link href="/#how-it-works">Cara bermain</Link>
        <Link href="/proof/founding-001">
          Transparansi <ArrowUpRight size={13} />
        </Link>
      </div>
    </footer>
  );
}
export function PageShell({
  children,
  focus = false,
}: {
  children: React.ReactNode;
  focus?: boolean;
}) {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className={`page-container content-width ${focus ? "focus-page" : ""}`}
      >
        {children}
      </main>
      {!focus && <Footer />}
      {!focus && <PulseCompanion />}
      {!focus && <MobileNavigation />}
    </>
  );
}

function countdown(deadline: string | null, now: number) {
  if (!deadline) return null;
  const seconds = Math.max(0, Math.floor((Date.parse(deadline) - now) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return `${hours ? `${hours}:` : ""}${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function PulseCompanion() {
  const { data: viewer } = useSession();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(0);
  const calls = useQuery({
    queryKey: ["calls"],
    queryFn: () => api<OpenCall[]>("calls"),
    enabled: !!viewer?.onboarded,
    refetchInterval: 15000,
  });
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  if (!viewer?.onboarded || path.startsWith("/calls")) return null;
  const call = calls.data?.[0];
  const remaining = countdown(call?.closesAt ?? null, now);
  const resolved = call?.stage === "resolved";
  const resolving = call?.stage === "resolving";
  const voided = call?.stage === "void";
  return (
    <div className="pulse-companion" data-open={open}>
      {open && (
        <aside className="pulse-panel" aria-label="Pulse Companion">
          <header>
            <div>
              <span className="pulse-live-dot" />
              <strong>PULSE</strong>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Tutup Pulse">
              <X size={16} />
            </button>
          </header>
          {calls.isPending ? (
            <div className="pulse-loading">Mencari Call yang hidup…</div>
          ) : !call ? (
            <div className="pulse-empty">
              <strong>Belum ada Pulse baru.</strong>
              <p>Call muncul setelah sumber outcome siap diverifikasi.</p>
            </div>
          ) : (
            <>
              <div className="pulse-message">
                <span className="pulse-orb">
                  <Radio size={17} />
                </span>
                <div>
                  <small>
                    {resolved
                      ? "OUTCOME AVAILABLE"
                      : voided
                        ? "CALL VOID"
                        : resolving
                          ? "RESOLVER ACTIVE"
                          : call.initialLocked
                            ? "YOUR CALL IS LOCKED"
                            : "NEW QUICK PULSE"}
                  </small>
                  <strong>
                    {resolved
                      ? `${call.outcome} · ${call.outcome === "A" ? call.optionA : call.optionB} menang.`
                      : voided
                        ? "Source tidak dapat diverifikasi."
                        : resolving
                          ? "Reality sedang memeriksa hasil."
                          : call.initialLocked
                            ? `${call.initialChoice} terkunci. Dengarkan Squad sebelum final call.`
                            : "Steam sedang bergerak. Apa prediksimu?"}
                  </strong>
                </div>
              </div>
              <div className="pulse-call-preview">
                <p>{call.question}</p>
                {!resolved && !resolving && !voided && remaining && (
                  <div className="pulse-timer">
                    <Clock3 size={13} />
                    <span>Prediksi tutup dalam</span>
                    <strong>{remaining}</strong>
                  </div>
                )}
                {resolving && (
                  <div className="pulse-resolving">
                    <i /> Snapshot akhir sedang diverifikasi
                  </div>
                )}
                {resolved && (
                  <div className="pulse-resolved">
                    <CheckCircle2 size={15} /> Hasil sudah sah dalam demo
                  </div>
                )}
              </div>
              <Button asChild className="pulse-cta">
                <Link
                  href={
                    resolved ? `/calls/${call.id}/result` : `/calls/${call.id}`
                  }
                >
                  {resolved
                    ? "Lihat hasil"
                    : call.initialLocked
                      ? "Buka diskusi"
                      : "Buat prediksi"}
                  <ArrowRight size={15} />
                </Link>
              </Button>
              <p className="pulse-demo-note">Steam snapshot · simulasi demo</p>
            </>
          )}
        </aside>
      )}
      <button
        className="pulse-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Tutup Pulse Companion" : "Buka Pulse Companion"}
      >
        <span className="pulse-trigger-icon">
          {resolved ? <CheckCircle2 size={19} /> : <Radio size={19} />}
          {call && !voided && <i />}
        </span>
        <span>
          <strong>Pulse</strong>
          <small>
            {resolved
              ? "Hasil tersedia"
              : call?.initialLocked
                ? (remaining ?? "Resolving")
                : call
                  ? "Call baru"
                  : "Anytime"}
          </small>
        </span>
      </button>
    </div>
  );
}

function MobileNavigation() {
  const { data: v } = useSession(),
    path = usePathname();
  if (!v) return null;
  const links = [
    { href: "/home", label: "Home", Icon: House },
    { href: "/arena", label: "Arena", Icon: Swords },
    { href: "/explore", label: "Hives", Icon: Users },
    { href: `/humans/${v.handle}`, label: "Profil", Icon: User },
  ];
  return (
    <div className="mobile-bottom-space">
      <nav className="mobile-bottom-nav" aria-label="Navigasi mobile">
        {links.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
          >
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
