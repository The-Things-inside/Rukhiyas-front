"use client";

import Header from "@/components/Header";
import MenuOverlay from "@/components/MenuOverlay";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const BRAND_YELLOW = "#E8B600";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function DesktopCTA({
  variant,
  children,
  onClick,
}: {
  variant: "fill" | "outline";
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[44px] w-[244px] rounded-[22px] px-[24px] text-[18px] font-bold font-[Satoshi] capitalize ${
        variant === "fill"
          ? `bg-[${BRAND_YELLOW}] text-[#FAFAFA]`
          : `border border-[${BRAND_YELLOW}] text-[${BRAND_YELLOW}]`
      }`}
    >
      {children}
    </button>
  );
}

function DesktopAboutHero() {
  const router = useRouter();
  return (
    <section className="bg-white flex items-center justify-center px-[60px] gap-[76px] pt-[56px] pb-[76px]">
      <div className="w-[668px] flex flex-col gap-[48px]">
        <div className="flex flex-col gap-[24px]">
          <motion.h1
            initial={{ opacity: 0, y: -130 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-bold font-[var(--font-spartan)] text-[48px] leading-[64px] text-black"
          >
            About Rukhiyas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="font-[Satoshi] text-[18px] leading-[26px] tracking-[0.36px] text-justify text-black"
          >
            Founded in 2002 in Mahe, Rukhiyas began as a single school transport
            service with a vision to make student commutes safe and reliable.
            Over the past two decades, we&apos;ve grown steadily, now serving seven
            local schools and transporting over 450 students in and around Mahe
            each day. Our commitment to punctuality and personalized service has
            kept families happy for more than 20 years.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
          className="flex gap-[10px]"
        >
          <DesktopCTA variant="fill" onClick={() => router.push("/register")}>
            Get started
          </DesktopCTA>
          <DesktopCTA variant="outline" onClick={() => router.push("/about")}>
            Learn more
          </DesktopCTA>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
        className="w-[674px] h-[450px] rounded-[32px] overflow-hidden relative"
      >
        <Image
          src="/assets/about/desktop/about-hero.jpg"
          alt="About Rukhiyas"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
    </section>
  );
}

function MobileButton({
  variant,
  children,
  onClick,
  className,
}: {
  variant: "fill" | "outline";
  children: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[44px] rounded-[22px] px-[24px] text-[18px] font-bold font-[Satoshi] capitalize ${
        variant === "fill"
          ? `bg-[${BRAND_YELLOW}] text-[#FAFAFA]`
          : `border border-[${BRAND_YELLOW}] text-[${BRAND_YELLOW}]`
      } ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

type AccordionItem = { title: string; body: string };

function MobileAccordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="w-[338px] flex flex-col gap-[16px]">
      {items.map((it, idx) => {
        const isOpen = idx === open;
        return (
          <div
            key={it.title}
            className={`${
              isOpen ? "bg-white rounded-[20px]" : "bg-[#FFFCF1] rounded-[12px]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : idx)}
              className="w-full flex items-center justify-between px-[24px] py-[16px]"
            >
              <span
                className={`text-[16px] ${
                  isOpen ? "font-[Satoshi]" : "font-[Plus Jakarta Sans]"
                } font-medium tracking-[0.96px] text-black`}
              >
                {it.title}
              </span>
              <span className="text-[24px] leading-none text-black">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="px-[24px] pb-[16px] font-[Satoshi] text-[16px] leading-[26px] tracking-[0.32px] text-black">
                {it.body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MobileAbout() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const accordionItems = useMemo<AccordionItem[]>(
    () => [
      {
        title: "Built on Trust",
        body: "For over 20 years, families in Mahe have trusted us to get their children to and from school safely and on time. That trust is what drives us, every single day.",
      },
      {
        title: "Safety Comes First",
        body: "From well-maintained vehicles to trained and background-checked drivers, safety isn't just a feature—it's our foundation.",
      },
      {
        title: "Real-Time Updates",
        body: "Stay in the loop with live tracking and instant alerts. Know exactly when your child is picked up, dropped off, or if there's a delay.",
      },
      {
        title: "Community-Centered Service",
        body: "We're not just a transport provider—we're part of the neighborhood. Our strong ties with local schools and families help us serve you better.",
      },
      {
        title: "Always On Time",
        body: "We take punctuality seriously. With carefully planned routes and experienced staff, we keep delays to a minimum and routines on track.",
      },
      {
        title: "Personal Support",
        body: "Have a question or need to make a change? Our caring support team is just a call away and always ready to help.",
      },
    ],
    [],
  );

  return (
    <div className="bg-[#14141B] min-h-screen">
      {/* Mobile header (Figma-like) */}
      <div className="sticky top-0 z-50 safe-area-top">
        <div className="relative h-[62px] w-full bg-[rgba(20,20,27,0.75)]">
          <div className="flex h-full items-center justify-between px-[24px]">
            <Image src="/assets/logo.svg" alt="RUKHIYAS" width={70} height={46} />
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
                onClick={() => setMenuOpen(true)}
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
        <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* White content container */}
      <div className="bg-white rounded-tl-[24px] rounded-tr-[24px] pt-[40px] px-[32px] pb-[40px]">
        <div className="flex flex-col items-center gap-[68px]">
          {/* About intro */}
          <div className="w-full flex flex-col items-center gap-[24px]">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="font-semibold font-[var(--font-spartan)] text-[28px] leading-[normal] text-black text-center"
            >
              About Rukhiyas
            </motion.h1>

            <div className="w-full flex flex-col gap-[20px]">
              <p className="font-[Satoshi] text-[16px] leading-[26px] tracking-[0.32px] text-justify text-[#0D0D0D]">
                Founded in 2002, Rukhiyas has been a trusted name in student
                transportation across Mahe for over two decades.
              </p>
              <p className="font-[Satoshi] text-[16px] leading-[26px] tracking-[0.32px] text-justify text-[#0D0D0D]">
                Today, we proudly serve over 450 students from 7 different
                schools in Mahe, ensuring that every child reaches their
                destination securely and on time.
              </p>

              <div className="flex gap-[24px] w-full">
                <MobileButton
                  variant="fill"
                  className="flex-1"
                  onClick={() => router.push("/register")}
                >
                  Get started
                </MobileButton>
                <MobileButton
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/about")}
                >
                  Learn more
                </MobileButton>
              </div>
            </div>
          </div>

          {/* Numbers */}
          <div className="w-full flex flex-col items-center gap-[24px]">
            <div className="font-semibold font-[var(--font-spartan)] text-[28px] leading-[38px] text-black text-center">
              Numbers Say It All
            </div>

            <div className="flex flex-col gap-[24px]">
              {/* 23+ */}
              <div className="bg-white rounded-[24px] w-[288px] px-[48px] py-[40px] shadow-[0px_3px_3px_rgba(0,0,0,0.04),0px_11px_5.5px_rgba(0,0,0,0.03),0px_25px_7.5px_rgba(0,0,0,0.02),0px_44px_9px_rgba(0,0,0,0.01)]">
                <div className="flex items-center justify-center gap-[12px]">
                  <img
                    src="/assets/about/mobile/icon-winner.svg"
                    alt=""
                    width={40}
                    height={40}
                  />
                  <div className="font-bold font-[Satoshi] text-[40px] text-[#E8B600]">
                    23+
                  </div>
                </div>
                <div className="mt-[8px] font-light font-[Satoshi] text-[20px] text-black text-center">
                  Years of Experience
                </div>
              </div>

              {/* 450+ */}
              <div className="bg-white rounded-[24px] w-[288px] px-[48px] py-[40px] shadow-[0px_3px_3px_rgba(0,0,0,0.04),0px_11px_5.5px_rgba(0,0,0,0.03),0px_25px_7.5px_rgba(0,0,0,0.02),0px_44px_9px_rgba(0,0,0,0.01)]">
                <div className="flex items-center justify-center gap-[14px]">
                  <div className="flex items-center">
                    <img
                      src="/assets/about/mobile/avatar-1.jpg"
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-white -mr-[12px] object-cover"
                    />
                    <img
                      src="/assets/about/mobile/avatar-2.jpg"
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-white -mr-[12px] object-cover"
                    />
                    <img
                      src="/assets/about/mobile/avatar-3.jpg"
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-white object-cover"
                    />
                  </div>
                  <div className="font-bold font-[Satoshi] text-[40px] text-[#E8B600]">
                    450+
                  </div>
                </div>
                <div className="mt-[8px] font-light font-[Satoshi] text-[20px] text-black text-center">
                  Students on Board
                </div>
              </div>

              {/* up to 7 */}
              <div className="bg-white border-2 border-[#E8B600] rounded-[24px] w-[288px] px-[48px] py-[40px] shadow-[0px_3px_3px_rgba(0,0,0,0.04),0px_11px_5.5px_rgba(0,0,0,0.03),0px_25px_7.5px_rgba(0,0,0,0.02),0px_44px_9px_rgba(0,0,0,0.01)]">
                <div className="flex items-center justify-center gap-[12px]">
                  <img
                    src="/assets/about/mobile/icon-school.svg"
                    alt=""
                    width={40}
                    height={40}
                  />
                  <div className="font-light font-[Satoshi] text-[40px] text-[#E8B600]">
                    Up to
                  </div>
                  <div className="font-bold font-[Satoshi] text-[40px] text-[#E8B600]">
                    7
                  </div>
                </div>
                <div className="mt-[8px] font-light font-[Satoshi] text-[20px] text-black text-center">
                  Schools Covered
                </div>
              </div>
            </div>

            <MobileButton
              variant="fill"
              className="w-full"
              onClick={() => router.push("/register")}
            >
              Register now
            </MobileButton>
          </div>

          {/* Why choose us */}
          <div className="w-full flex flex-col items-center gap-[24px]">
            <div className="font-semibold font-[var(--font-spartan)] text-[28px] text-black text-center">
              Why Choose Us?
            </div>
            <MobileAccordion items={accordionItems} />
            <div className="flex gap-[24px] w-full">
              <MobileButton
                variant="fill"
                className="flex-1"
                onClick={() => router.push("/register")}
              >
                Resister now
              </MobileButton>
              <MobileButton
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/about")}
              >
                Learn more
              </MobileButton>
            </div>
          </div>
        </div>
      </div>

      {/* Figma footer is dark; reuse existing one to keep exact spacing close */}
      <div className="bg-[#14141B] rounded-tl-[24px] rounded-tr-[24px] py-[40px]">
        <div className="px-[24px] flex items-center justify-between">
          <Image src="/assets/logo.svg" alt="RUKHIYAS" width={70} height={46} />
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="h-[52px] w-[52px] rounded-[30px] bg-[#F0F0F0] grid place-items-center"
          >
            <span className="text-[20px] leading-none">↑</span>
          </button>
        </div>

        <div className="mt-[24px] px-[24px] text-white text-[14px] font-[Satoshi]">
          {["About", "School Transport", "Bus Rentals/Hire", "Contact Us", "Terms & Policies"].map((x, i) => (
            <div
              key={x}
              className={`py-[16px] ${i < 3 ? "border-b-2 border-[#585858]" : ""}`}
            >
              {x}
            </div>
          ))}
        </div>

        <div className="mt-[24px] flex items-center justify-center gap-[16px]">
          <img src="/assets/about/mobile/social-linkedin.svg" alt="LinkedIn" width={40} height={40} />
          <img src="/assets/about/mobile/social-facebook.svg" alt="Facebook" width={40} height={40} />
          <img src="/assets/about/mobile/social-instagram.svg" alt="Instagram" width={40} height={40} />
        </div>

        <div className="mt-[24px] text-center font-bold font-[var(--font-spartan)] text-[12px] text-[#9A9A9A]">
          © 2025. All Right Reserved
        </div>
      </div>
    </div>
  );
}

export default function AboutPageView() {
  return (
    <div className="min-h-screen" style={{ background: "#FFFCF1" }}>
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="fixed top-0 left-0 w-full z-50 md:bg-amber-50">
          <Header />
        </div>
        <main className="pt-[128px]">
          <DesktopAboutHero />
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <MobileAbout />
      </div>
    </div>
  );
}

