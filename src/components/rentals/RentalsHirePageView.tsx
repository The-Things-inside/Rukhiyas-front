"use client";

/* eslint-disable @next/next/no-img-element */

import Header from "@/components/Header";
import MenuOverlay from "@/components/MenuOverlay";
import { DesktopSiteFooter, MobileSiteFooter } from "@/components/SiteFooter";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type OccasionCard = {
  title: string;
  body: string;
  src: string;
};

const DESKTOP_OCCASIONS: OccasionCard[] = [
  {
    title: "Group Tours & Trips",
    body: "Worry free transportation for you, so that you can enjoy your vacation fully.",
    src: "/assets/rentals/desktop/occasion-trips.jpg",
  },
  {
    title: "Wedding Guests",
    body: "Punctual and comfortable transportation for your wedding guests",
    src: "/assets/rentals/desktop/occasion-wedding.jpg",
  },
  {
    title: "Corporate Retreats & Events",
    body: "Reliable and professional transportation for your corporate needs.",
    src: "/assets/rentals/desktop/occasion-corporate.jpg",
  },
];

const FLEET = [
  { name: "Mahindra Cosmo", seats: "19 Seater", src: "/assets/rentals/desktop/fleet-1.jpg" },
  { name: "Mahindra Cosmo", seats: "19 Seater", src: "/assets/rentals/desktop/fleet-2.jpg" },
  { name: "Mahindra Cosmo", seats: "19 Seater", src: "/assets/rentals/desktop/fleet-3.jpg" },
];

function DesktopHero() {
  const router = useRouter();

  return (
    <section className="bg-white pb-[100px]">
      <div className="mx-auto max-w-[1920px] px-[60px]">
        <div className="flex flex-col items-center gap-[48px] pt-[56px]">
          <div className="flex flex-col items-center gap-[24px] text-black">
            <motion.h1
              initial={{ opacity: 0, y: -160 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-bold font-[var(--font-spartan)] text-[48px] leading-[64px] text-center"
            >
              Bus Rentals for Groups &amp; Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="font-[Satoshi] text-[18px] leading-[26px] tracking-[0.36px] text-center w-[1128px]"
            >
              Our bus rental services provide safe, reliable, and stress-free
              transportation for any occasion. Whether it&apos;s a wedding, group
              tour, corporate outing, or family function.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="flex items-start gap-[32px]"
          >
            {DESKTOP_OCCASIONS.map((c) => (
              <div
                key={c.title}
                className="w-[338px] rounded-[24px] overflow-hidden bg-white shadow-[0px_69px_19px_rgba(0,0,0,0),0px_44px_18px_rgba(0,0,0,0.01),0px_25px_15px_rgba(0,0,0,0.02),0px_11px_11px_rgba(0,0,0,0.03),0px_3px_6px_rgba(0,0,0,0.04)]"
              >
                <div className="relative h-[238px] w-full">
                  <Image src={c.src} alt="" fill className="object-cover" />
                </div>
                <div className="px-[16px] py-[24px] text-center">
                  <div className="font-semibold font-[var(--font-spartan)] text-[18px] tracking-[0.36px] text-black">
                    {c.title}
                  </div>
                  <div className="mt-[4px] font-[Satoshi] text-[16px] tracking-[0.32px] leading-[22px] text-black">
                    {c.body}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.25 }}
            onClick={() => router.push("/contact")}
            className="h-[44px] w-[244px] rounded-[22px] bg-[#E8B600] px-[24px] py-[10px] font-bold font-[Satoshi] text-[18px] text-white capitalize"
          >
            call to book
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function DesktopFleet() {
  const router = useRouter();

  return (
    <section className="bg-[#FFFCF1] py-[100px]">
      <div className="mx-auto max-w-[1920px] px-[240px]">
        <div className="flex flex-col items-center gap-[48px] text-black">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="flex flex-col items-center gap-[24px]"
          >
            <h2 className="font-bold font-[var(--font-spartan)] text-[48px] leading-[64px]">
              Our Fleet
            </h2>
            <p className="font-[Satoshi] text-[18px] leading-[26px] tracking-[0.36px] text-center w-[1078px]">
              Hire our bus for tailored travel solutions that accommodate all
              group sizes with flexible scheduling to suit your needs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex items-start gap-[32px]"
          >
            {FLEET.map((x, idx) => (
              <div
                key={`${x.name}-${idx}`}
                className="w-[338px] rounded-[24px] overflow-hidden bg-white shadow-[0px_69px_19px_rgba(0,0,0,0),0px_44px_18px_rgba(0,0,0,0.01),0px_25px_15px_rgba(0,0,0,0.02),0px_11px_11px_rgba(0,0,0,0.03),0px_3px_6px_rgba(0,0,0,0.04)]"
              >
                <div className="relative h-[238px] w-full">
                  <Image src={x.src} alt="" fill className="object-cover" />
                </div>
                <div className="flex items-center justify-between px-[16px] py-[16px] text-black">
                  <div className="font-semibold font-[var(--font-spartan)] text-[16px] leading-[28px] tracking-[0.32px]">
                    {x.name}
                  </div>
                  <div className="font-[Satoshi] text-[16px] leading-[28px] tracking-[0.32px]">
                    {x.seats}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="font-[Satoshi] text-[18px] leading-[26px] tracking-[0.36px] text-center w-[1078px]"
          >
            In addition to our fleet, we offer the flexibility to arrange
            additional buses for larger groups.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.65, ease: EASE }}
            onClick={() => router.push("/contact")}
            className="h-[44px] w-[244px] rounded-[22px] bg-[#E8B600] px-[24px] py-[10px] font-bold font-[Satoshi] text-[18px] text-white capitalize"
          >
            call to book
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function MobileHeaderBar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 safe-area-top">
      <div className="relative h-[62px] w-full bg-[rgba(20,20,27,0.75)]">
        <div className="flex h-full items-center justify-between px-[24px]">
          <button type="button" onClick={() => router.push("/")} aria-label="Go to home">
            <Image src="/assets/logo.svg" alt="RUKHIYAS" width={70} height={46} />
          </button>
          <div className="flex items-center gap-[16px]">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="h-[32px] rounded-[22px] bg-[#E8B600] px-[20px] text-[16px] font-medium text-[#14141B]"
            >
              Log in
            </button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={onMenu}
              className="h-[36px] w-[36px] grid place-items-center"
            >
              <div className="flex flex-col gap-[4.5px]">
                <span className="h-[3px] w-[26px] bg-white" />
                <span className="h-[3px] w-[26px] bg-white" />
                <span className="h-[3px] w-[26px] bg-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileRentals() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const occasions = useMemo<OccasionCard[]>(
    () => [
      {
        title: "Wedding Guests",
        body: "Punctual and comfortable transportation for your wedding guests",
        src: "/assets/rentals/desktop/occasion-wedding.jpg",
      },
      {
        title: "Group Tours & Trips",
        body: "Worry free transportation for you, so that you can enjoy your vacation fully.",
        src: "/assets/rentals/mobile/occasion-group-tours.jpg",
      },
      {
        title: "Corporate Retreats & Events",
        body: "Reliable and professional transportation for your corporate needs.",
        src: "/assets/rentals/desktop/occasion-corporate.jpg",
      },
    ],
    [],
  );

  const current = occasions[idx];

  return (
    <div className="bg-[#14141B] min-h-screen">
      <MobileHeaderBar onMenu={() => setMenuOpen(true)} />
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="bg-white rounded-tl-[24px] rounded-tr-[24px] overflow-hidden">
        <div className="px-[32px] pt-[32px] flex flex-col items-center gap-[16px] text-black">
          <motion.h1
            initial={{ opacity: 0, y: -28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-semibold font-[var(--font-spartan)] text-[28px] leading-[40px] text-center w-[314px]"
          >
            Bus Rentals for Groups &amp; Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            className="font-[Satoshi] text-[16px] leading-[28px] tracking-[0.32px] text-justify w-[341px]"
          >
            Our bus rental services provide safe, reliable, and stress-free
            transportation for any occasion. Whether it&apos;s a wedding, group
            tour, corporate outing, or family function.
          </motion.p>
        </div>

        <div className="mt-[16px] px-[32px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="bg-white rounded-[24px] overflow-hidden shadow-[0px_69px_19px_rgba(0,0,0,0),0px_44px_18px_rgba(0,0,0,0.01),0px_25px_15px_rgba(0,0,0,0.02),0px_11px_11px_rgba(0,0,0,0.03),0px_3px_6px_rgba(0,0,0,0.04)]"
            >
              <div className="relative h-[238px] w-full">
                <Image src={current.src} alt="" fill className="object-cover" />
              </div>
              <div className="px-[16px] py-[24px] text-center">
                <div className="font-semibold font-[var(--font-spartan)] text-[18px] tracking-[0.36px]">
                  {current.title}
                </div>
                <div className="mt-[4px] font-[Satoshi] text-[16px] tracking-[0.32px]">
                  {current.body}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-[10px] flex justify-center gap-[6px]">
            {occasions.map((_, i) => (
              <div
                key={i}
                className={`h-[6px] w-[6px] rounded-full ${i === idx ? "bg-[#CFCFCF]" : "bg-[#E7E7E7]"}`}
              />
            ))}
          </div>

          <div className="mt-[18px] flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/contact")}
              className="h-[44px] w-[164px] rounded-[22px] bg-[#E8B600] font-bold font-[Satoshi] text-[18px] text-white capitalize"
            >
              Call To Book
            </button>
            <div className="flex items-center gap-[16px]">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => setIdx((v) => (v + occasions.length - 1) % occasions.length)}
                className="h-[52px] w-[52px] rounded-[30px] bg-[#F0F0F0] grid place-items-center"
              >
                <span className="text-[22px] leading-none">←</span>
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => setIdx((v) => (v + 1) % occasions.length)}
                className="h-[52px] w-[52px] rounded-[30px] bg-[#F0F0F0] grid place-items-center"
              >
                <span className="text-[22px] leading-none">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fleet section */}
        <div className="mt-[68px] px-[32px] pb-[40px] text-black">
          <div className="flex flex-col items-center gap-[16px]">
            <div className="font-semibold font-[var(--font-spartan)] text-[28px] tracking-[0.56px]">
              Our Fleet
            </div>
            <p className="font-[Satoshi] text-[16px] leading-[28px] tracking-[0.32px] text-justify w-[341px]">
              Hire our bus for tailored travel solutions that accommodate all group sizes with flexible scheduling to suit your needs.
            </p>
          </div>

          <div className="mt-[24px] flex flex-col gap-[24px]">
            {FLEET.map((x, i) => (
              <div
                key={`${x.name}-${i}`}
                className="bg-white rounded-[24px] overflow-hidden shadow-[0px_69px_19px_rgba(0,0,0,0),0px_44px_18px_rgba(0,0,0,0.01),0px_25px_15px_rgba(0,0,0,0.02),0px_11px_11px_rgba(0,0,0,0.03),0px_3px_6px_rgba(0,0,0,0.04)]"
              >
                <div className="relative h-[238px] w-full">
                  <Image src={x.src} alt="" fill className="object-cover" />
                </div>
                <div className="flex items-center justify-between px-[16px] py-[16px]">
                  <div className="font-semibold font-[var(--font-spartan)] text-[16px] leading-[28px] tracking-[0.32px]">
                    {x.name}
                  </div>
                  <div className="font-[Satoshi] text-[16px] leading-[28px] tracking-[0.32px]">
                    {x.seats}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-[24px] font-normal font-[var(--font-spartan)] text-[16px] leading-[24px] tracking-[0.32px] text-justify">
            In addition to our fleet, we offer the flexibility to arrange additional buses for larger groups.
          </p>

          <button
            type="button"
            onClick={() => router.push("/contact")}
            className="mt-[24px] h-[44px] w-full rounded-[22px] bg-[#E8B600] font-bold font-[Satoshi] text-[18px] text-white capitalize"
          >
            Call to book
          </button>
        </div>

        {/* Home footer requirement */}
        <MobileSiteFooter />
      </div>
    </div>
  );
}

export default function RentalsHirePageView() {
  return (
    <div className="min-h-screen" style={{ background: "#FFFCF1" }}>
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="fixed top-0 left-0 w-full z-50 md:bg-amber-50">
          <Header />
        </div>
        <main className="pt-[128px]">
          <DesktopHero />
          <DesktopFleet />
          <DesktopSiteFooter />
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <MobileRentals />
      </div>
    </div>
  );
}

