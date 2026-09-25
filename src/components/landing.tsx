"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, MoveUpRight } from "lucide-react";
import { Header, Footer } from "./shell";
import { Avatar, AvatarGroup, Crest, Sigil } from "./identity";
import { Button } from "./ui/button";
import { hives } from "@/domain/community";
export function Landing() {
  return (
    <>
      <Header />
      <main id="main-content" className="landing-atmosphere">
        <section className="landing-hero content-width">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="tiny-star">✳</span>A PLACE FOR YOUR PEOPLE
            </p>
            <h1>
              Beda pikiran.
              <br />
              <span>Satu frekuensi.</span>
            </h1>
            <p className="hero-description">
              Temukan orang-orangmu. Bentuk Squad.
              <br className="desktop-only" /> Bawa sudut pandang komunitasmu ke
              Arena.
            </p>
            <div className="hero-actions">
              <Button size="lg" asChild>
                <Link href="/explore">
                  Temukan Hivemu <ArrowUpRight size={17} />
                </Link>
              </Button>
              <Link className="text-link" href="/replays/founding-001">
                Lihat cara bermain
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-footnote">
              <span>
                <Check size={13} />
                Tanpa taruhan
              </span>
              <span>
                <Check size={13} />
                Lebih seru bersama
              </span>
            </div>
          </div>
          <div
            className="hero-art"
            aria-label="Ilustrasi komunitas Purple dan Squad Aster"
          >
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="floating-face face-one">
              <Avatar index={2} size={52} />
              <span>Mika</span>
            </div>
            <div className="floating-face face-two">
              <Avatar index={1} size={44} />
            </div>
            <div className="floating-face face-three">
              <Avatar index={3} size={52} />
              <span>Juno</span>
            </div>
            <div className="hero-community">
              <div className="community-art-top">
                <Sigil size={66} />
                <span className="little-label">YOUR HIVE</span>
              </div>
              <h2>Purple</h2>
              <p>Curious minds. Shared momentum.</p>
              <div className="art-members">
                <AvatarGroup />
                <span>20 people, one Hive</span>
              </div>
              <div className="art-squad">
                <Crest />
                <div>
                  <strong>Aster</strong>
                  <span>Your people are here.</span>
                </div>
                <span className="online-indicator" />
              </div>
            </div>
            <div className="floating-note">
              <span>✳</span>Your voice matters.
            </div>
            <div className="floating-arena">
              <div className="arena-art-icon">
                <MoveUpRight size={20} />
              </div>
              <div>
                <span>NEXT UP · DEMO ARENA</span>
                <strong>
                  Purple <span>vs</span> Chog
                </strong>
              </div>
              <ArrowUpRight size={17} />
            </div>
          </div>
        </section>
        <section className="belonging-strip content-width">
          <p>
            BIG IDEAS START
            <br />
            <strong>WITH YOUR PEOPLE.</strong>
          </p>
          <div>
            <Avatar index={0} size={38} />
            <span>
              <strong>Human</strong>
              <small>Sudut pandangmu.</small>
            </span>
          </div>
          <ArrowRight className="hierarchy-arrow" size={18} />
          <div>
            <Crest size={38} />
            <span>
              <strong>Squad</strong>
              <small>Lingkaran terdekatmu.</small>
            </span>
          </div>
          <ArrowRight className="hierarchy-arrow" size={18} />
          <div>
            <Sigil size={42} />
            <span>
              <strong>Hive</strong>
              <small>Komunitas yang kamu bawa.</small>
            </span>
          </div>
        </section>
        <section id="how-it-works" className="how-section content-width">
          <div className="section-intro">
            <p className="eyebrow">SOCIAL BY NATURE. COMPETITIVE TOGETHER.</p>
            <h2>
              Datang untuk komunitas.
              <br />
              <span>Tinggal untuk momennya.</span>
            </h2>
            <p>
              Di sini, kamu boleh punya keyakinan.
              <br />
              Dan punya keberanian untuk mengubahnya.
            </p>
          </div>
          <div className="steps-grid">
            {[
              {
                n: "01",
                title: "Temukan lingkaranmu",
                text: "Mulai sebagai Human. Bergabung dengan 3–5 orang dalam Squad, lalu jadi bagian dari Hive.",
                art: (
                  <div className="step-avatars">
                    <Avatar index={0} size={44} />
                    <Avatar index={2} size={44} />
                    <Avatar index={1} size={44} />
                    <span>+</span>
                  </div>
                ),
              },
              {
                n: "02",
                title: "Bawa perspektifmu",
                text: "Berpikir sendiri, diskusikan bersama Squad, lalu kunci pilihan. Setiap Squad punya bobot yang sama.",
                art: (
                  <div className="step-choice">
                    <span>A</span>
                    <i />
                    <span>B</span>
                  </div>
                ),
              },
              {
                n: "03",
                title: "Buka pikiran. Rayakan.",
                text: "Lihat perbedaan, dengarkan alasan lain, dan pilih untuk bertahan atau berubah. Hasil menjadi cerita bersama.",
                art: (
                  <div className="step-belief">
                    <span>55%</span>
                    <ArrowRight size={20} />
                    <strong>70%</strong>
                    <small>Belief shift · contoh</small>
                  </div>
                ),
              },
            ].map((s) => (
              <article key={s.n}>
                <div className="step-art">{s.art}</div>
                <p className="step-number">{s.n}</p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="discover-section content-width">
          <div className="section-title">
            <div>
              <p className="eyebrow">FIND YOUR FREQUENCY</p>
              <h2>Ada tempat untukmu di sini.</h2>
            </div>
            <Link className="text-link" href="/explore">
              Jelajahi semua Hive
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hive-preview-grid">
            {hives.slice(0, 3).map((h) => (
              <Link
                href={`/hives/${h.slug}`}
                key={h.id}
                className="hive-preview"
              >
                <div>
                  <Sigil symbol={h.symbol} color={h.color} />
                  <ArrowUpRight size={18} />
                </div>
                <h3>{h.name}</h3>
                <p>{h.tagline}</p>
                <div className="preview-bottom">
                  <AvatarGroup count={3} size={23} />
                  <span>{h.members} anggota · demo</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="landing-cta content-width">
          <span className="tiny-star">✳</span>
          <h2>Orang-orangmu ada di luar sana.</h2>
          <p>Temukan mereka. Buat sesuatu yang layak diceritakan.</p>
          <Button size="lg" asChild>
            <Link href="/sign-in">
              Mulai ceritamu <ArrowUpRight size={17} />
            </Link>
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}
