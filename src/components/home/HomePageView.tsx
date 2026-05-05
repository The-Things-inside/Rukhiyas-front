"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import Header from "@/components/Header";
import MenuOverlay from "@/components/MenuOverlay";

const BRAND_YELLOW = "#E8B600";

function MobileButton({
  variant = "fill",
  children,
  onClick,
  className,
}: {
  variant?: "fill" | "outline";
  children: string;
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "h-[44px] rounded-[22px] px-[24px] text-[18px] font-bold font-[Satoshi] leading-[normal] capitalize flex items-center justify-center";
  const styles =
    variant === "fill"
      ? `bg-[${BRAND_YELLOW}] text-[#FAFAFA]`
      : `border border-[${BRAND_YELLOW}] text-[${BRAND_YELLOW}] bg-transparent`;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${styles} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

function MobileHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 safe-area-top">
      <div className="relative h-[62px] w-full bg-[rgba(20,20,27,0.75)]">
        <div className="flex h-full items-center justify-between px-[24px]">
          <div className="h-[46px] w-[70px] relative">
            <Image
              src="/assets/logo.svg"
              alt="RUKHIYAS"
              width={70}
              height={46}
              priority
            />
          </div>
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
  );
}

function HeadingHero() {
  return (
    <div className="px-[25.5px] pt-[24px]">
      <div className="relative h-[76px] w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="font-semibold text-[28px] leading-[38px] text-center text-white font-[var(--font-spartan)] whitespace-nowrap"
        >
          <div>Safe &amp; Reliable</div>
          <div>Student Transportation</div>
        </motion.div>
      </div>
      <div className="relative h-[189px] mt-[16px]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#14141B] to-[#0F0F14]" />
        <motion.div
          initial={{ opacity: 0, x: 260 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="absolute right-[18px] top-[18px] w-[199px]"
        >
          <Image
            src="/assets/home/mobile/hero-bus.png"
            alt=""
            width={199}
            height={151}
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}

function IntroCopy() {
  const router = useRouter();
  return (
    <div className="px-[40px] pt-[40px]">
      <div className="w-[322px] mx-auto flex flex-col gap-[16px]">
        <p className="font-medium font-[var(--font-spartan)] text-[20px] leading-[28px] tracking-[0.4px] text-center text-black">
          Ensuring your child’s safe journey to school, every day.
        </p>
        <div className="flex flex-col gap-[20px]">
          <p className="font-[Satoshi] text-[16px] leading-[26px] tracking-[0.32px] text-justify text-[#0D0D0D]">
            We deliver safe, efficient, and reliable transportation so you can
            focus on what matters most—your child’s well-being
          </p>
          <div className="flex gap-[24px]">
            <MobileButton
              variant="fill"
              className="flex-1"
              onClick={() => router.push("/register")}
            >
              Register now
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
  );
}

type CarouselItem = {
  titleAccent: string;
  titleBody: string;
  imageSrc: string;
};

function CommitmentCarousel() {
  const router = useRouter();

  const items: CarouselItem[] = useMemo(
    () => [
      {
        titleAccent: "Live GPS Tracking",
        titleBody: "Get real-time location updates and arrival alerts.",
        imageSrc: "/assets/home/mobile/commitment-card-1.jpg",
      },
      {
        titleAccent: "Safe Rides",
        titleBody: "Experienced, background-checked drivers at your service.",
        imageSrc: "/assets/home/mobile/commitment-card-2.jpg",
      },
      {
        titleAccent: "Always On Time",
        titleBody: "Ensuring your child arrives on schedule every day.",
        imageSrc: "/assets/home/mobile/commitment-card-3.jpg",
      },
    ],
    [],
  );

  const [idx, setIdx] = useState(0);
  const go = (next: number) => setIdx((next + items.length) % items.length);
  const active = items[idx];

  return (
    <div className="px-[32px] pt-[282px]">
      <div className="w-[338px] mx-auto flex flex-col items-center gap-[24px]">
        <div className="font-semibold font-[var(--font-spartan)] text-[28px] leading-[38px] text-center text-[#0D0D0D]">
          <div>Your Child’s Journey,</div>
          <div>Our Commitment</div>
        </div>

        <div className="relative w-[338px] h-[414px]">
          <div className="relative w-[338px] h-[338px] rounded-[24px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.imageSrc}
                initial={{ opacity: 0.0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.0, scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={active.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="338px"
                />
                <div className="absolute inset-x-0 bottom-0 h-[146px] bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.4)] to-transparent p-[30px] flex items-end">
                  <div className="text-[16px] leading-[22px] text-white font-[var(--font-spartan)]">
                    <div className="font-extrabold text-[#E8B600]">
                      {active.titleAccent}
                    </div>
                    <div className="font-medium">{active.titleBody}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute left-[154px] top-[348px] h-[10px] w-[30px] flex items-center justify-center gap-[6px]">
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-[6px] w-[6px] rounded-full ${
                  i === idx ? "bg-[#E8B600]" : "bg-[#D9D9D9]"
                }`}
              />
            ))}
          </div>

          <div className="absolute left-[218px] top-[362px] flex gap-[16px]">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(idx - 1)}
              className="h-[52px] w-[52px] rounded-[30px] bg-[#F0F0F0] opacity-60 grid place-items-center"
            >
              <span className="text-[22px] leading-none">‹</span>
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(idx + 1)}
              className="h-[52px] w-[52px] rounded-[30px] bg-[#F0F0F0] grid place-items-center"
            >
              <span className="text-[22px] leading-none">›</span>
            </button>
          </div>

          <div className="absolute left-0 top-[366px]">
            <MobileButton variant="fill" onClick={() => router.push("/register")}>
              Register now
            </MobileButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function RentalsCarousel() {
  const items = useMemo(
    () => [
      {
        title: "Wedding Guests",
        subtitle:
          "Punctual and comfortable transportation for your wedding guests",
        imageSrc: "/assets/home/mobile/rental-wedding.jpg",
      },
      {
        title: "Group Tours & Trips",
        subtitle:
          "Worry free transportation for you, so that you can enjoy your vacation fully.",
        imageSrc: "/assets/home/mobile/rental-group.jpg",
      },
      {
        title: "Corporate Retreats & Events",
        subtitle: "Reliable and professional transportation for your corporate needs.",
        imageSrc: "/assets/home/mobile/rental-corporate.jpg",
      },
    ],
    [],
  );
  const [idx, setIdx] = useState(0);
  const active = items[idx];
  const go = (n: number) => setIdx((n + items.length) % items.length);

  return (
    <div className="bg-[#14141B] px-[31px] pt-[40px]">
      <div className="mx-auto w-[341px] flex flex-col items-center gap-[32px]">
        <div className="text-center text-white font-[var(--font-spartan)]">
          <div className="font-semibold text-[28px] leading-[38px]">
            Event &amp; Group
          </div>
          <div className="font-semibold text-[28px] leading-[38px]">
            Transport Options
          </div>
        </div>
        <p className="font-normal font-[var(--font-spartan)] text-[16px] leading-[28px] tracking-[0.32px] text-justify text-white">
          Beyond our daily student transport, we also offer tailored bus rental
          solutions for special events and group travel.
        </p>

        <div className="w-[338px]">
          <div className="relative rounded-[24px] overflow-hidden bg-[#FFFAEA] shadow-[0px_3px_6px_rgba(0,0,0,0.04),0px_11px_11px_rgba(0,0,0,0.03),0px_25px_15px_rgba(0,0,0,0.02),0px_44px_18px_rgba(0,0,0,0.01)]">
            <div className="relative h-[238px] w-full">
              <Image src={active.imageSrc} alt="" fill className="object-cover" />
            </div>
            <div className="px-[16px] pb-[24px] pt-[18px] text-center text-black">
              <div className="font-semibold font-[var(--font-spartan)] text-[18px] tracking-[0.36px]">
                {active.title}
              </div>
              <div className="font-[Satoshi] text-[16px] tracking-[0.32px]">
                {active.subtitle}
              </div>
            </div>
          </div>

          <div className="mt-[12px] flex justify-center gap-[6px]">
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-[6px] w-[6px] rounded-full ${
                  i === idx ? "bg-[#E8B600]" : "bg-[#D9D9D9]"
                }`}
              />
            ))}
          </div>

          <div className="mt-[16px] flex items-center gap-[16px]">
            <MobileButton variant="fill" className="flex-1">
              Call to book
            </MobileButton>
            <div className="flex gap-[16px]">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => go(idx - 1)}
                className="h-[52px] w-[52px] rounded-[30px] bg-[#F0F0F0] opacity-60 grid place-items-center"
              >
                <span className="text-[22px] leading-none">‹</span>
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => go(idx + 1)}
                className="h-[52px] w-[52px] rounded-[30px] bg-[#F0F0F0] grid place-items-center"
              >
                <span className="text-[22px] leading-none">›</span>
              </button>
            </div>
          </div>
        </div>
        <div className="h-[32px]" />
      </div>
    </div>
  );
}

function FleetSection() {
  const items = useMemo(
    () => [
      { name: "Mahindra Cosmo", seats: "19 Seater", src: "/assets/home/mobile/fleet-1.jpg" },
      { name: "Mahindra Cosmo", seats: "19 Seater", src: "/assets/home/mobile/fleet-2.jpg" },
      { name: "Mahindra Cosmo", seats: "19 Seater", src: "/assets/home/mobile/fleet-3.jpg" },
    ],
    [],
  );
  return (
    <div className="bg-[#14141B] px-[32.5px] pt-[40px]">
      <div className="mx-auto w-[338px] flex flex-col items-center gap-[32px]">
        <div className="font-semibold font-[var(--font-spartan)] text-[28px] tracking-[0.56px] text-white">
          Our Fleet
        </div>
        <div className="flex flex-col gap-[24px] w-full">
          {items.map((it, i) => (
            <div
              key={i}
              className="w-full overflow-hidden rounded-[24px] bg-[#FFFAEA] shadow-[0px_3px_6px_rgba(0,0,0,0.04),0px_11px_11px_rgba(0,0,0,0.03),0px_25px_15px_rgba(0,0,0,0.02),0px_44px_18px_rgba(0,0,0,0.01)]"
            >
              <div className="relative h-[238px] w-full">
                <Image src={it.src} alt="" fill className="object-cover" />
              </div>
              <div className="flex items-center justify-between px-[16px] py-[16px] text-black">
                <div className="font-semibold font-[var(--font-spartan)] text-[16px] leading-[28px] tracking-[0.32px]">
                  {it.name}
                </div>
                <div className="font-[Satoshi] text-[16px] leading-[28px] tracking-[0.32px]">
                  {it.seats}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="font-normal font-[var(--font-spartan)] text-[16px] leading-[24px] tracking-[0.32px] text-justify text-white">
          In addition to our fleet, we offer the flexibility to arrange
          additional buses for larger groups.
        </p>
        <MobileButton variant="fill" className="w-auto">
          Call to book
        </MobileButton>
        <div className="h-[24px]" />
      </div>
    </div>
  );
}

function MobileFooter() {
  const router = useRouter();
  return (
    <div className="bg-white rounded-tl-[24px] rounded-tr-[24px] py-[40px] flex flex-col items-center gap-[24px]">
      <div className="w-full px-[24px] flex items-end justify-between">
        <Image src="/assets/logo.svg" alt="RUKHIYAS" width={70} height={46} />
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-[52px] w-[52px] rounded-[30px] bg-[#F0F0F0] grid place-items-center"
        >
          <span className="text-[20px] leading-none">↑</span>
        </button>
      </div>

      <div className="w-full px-[24px]">
        {[
          { label: "About", href: "/about" },
          { label: "School Transport", href: "/school-transportation" },
          { label: "Bus Rentals/Hire", href: "/rentals-hire" },
          { label: "Contact Us", href: "/contact" },
          { label: "Terms & Policies", href: "/terms" },
        ].map((x, i) => (
          <button
            key={x.label}
            type="button"
            onClick={() => router.push(x.href)}
            className={`w-full py-[16px] text-left text-[14px] font-[Satoshi] font-medium text-black ${
              i < 3 ? "border-b-2 border-[#EDEDED]" : ""
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-[16px]">
        <img
          src="/assets/home/mobile/social-linkedin.png"
          alt="LinkedIn"
          width={40}
          height={40}
        />
        <img
          src="/assets/home/mobile/social-facebook.png"
          alt="Facebook"
          width={40}
          height={40}
        />
        <img
          src="/assets/home/mobile/social-instagram.png"
          alt="Instagram"
          width={40}
          height={40}
        />
      </div>

      <div className="font-bold font-[var(--font-spartan)] text-[12px] text-[#5E5E5E]">
        © 2025. All Right Reserved
      </div>
    </div>
  );
}

export default function HomePageView() {
  return (
    <div className="min-h-screen">
      {/* Mobile-only implementation */}
      <div className="md:hidden">
        <div className="bg-[#14141B]">
          <MobileHeader />
          <HeadingHero />
        </div>

        <div className="bg-[#FFFCF1]">
          <IntroCopy />
          <CommitmentCarousel />
          <RentalsCarousel />
          <FleetSection />
          <MobileFooter />
        </div>
      </div>

      {/* Desktop stays as-is */}
      <div className="hidden md:block">
        <div className="min-h-screen" style={{ background: "#FFFCF1" }}>
          <div className="fixed top-0 left-0 w-full z-50 md:bg-amber-50">
            <Header />
          </div>
          <main className="pt-[128px]">{/* existing desktop layout */}</main>
        </div>
      </div>
    </div>
  );
}

