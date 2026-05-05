/* eslint-disable @next/next/no-img-element */
"use client";

import { League_Spartan } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const IMG_SCHOOL_BUS =
  "https://www.figma.com/api/mcp/asset/ffc27ba2-e302-4ba8-a385-0d3ecbf29380";

const COMMITMENT_CARDS = [
  {
    src: "https://www.figma.com/api/mcp/asset/d370acc8-fca3-4639-9002-fab3bfed33b9",
    title: "Live GPS Tracking",
    body: "Get real-time location updates and arrival alerts.",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/e10233e5-c790-469a-9176-7c41cd51211a",
    title: "Safe Rides",
    body: "Experienced, background-checked drivers at your service.",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/1bb859d1-d8e8-4daa-8769-e673257067a3",
    title: "Always On Time",
    body: "Ensuring your child arrives on schedule every day.",
  },
] as const;

const IMG_PHONE_DASH =
  "https://www.figma.com/api/mcp/asset/96e3d2f1-d657-4bf9-a478-01986cc83044";
const IMG_PHONE_MAP =
  "https://www.figma.com/api/mcp/asset/c0819e6d-0b52-4d49-8198-35002dfa7250";
const IMG_PHONE_BEZEL =
  "https://www.figma.com/api/mcp/asset/f062301a-8b42-4802-8bec-af0281a0696a";

function MobileButton({
  variant,
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "fill" | "outline";
}) {
  const base =
    "flex min-h-0 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-[22px] px-6 py-2.5 text-[18px] font-bold capitalize leading-none tracking-normal md:w-auto md:flex-none md:min-w-[148px]";
  if (variant === "fill") {
    return (
      <button
        type="button"
        className={`${base} bg-[#e8b600] text-[#fafafa] ${className}`}
        style={{ fontFamily: "Satoshi, sans-serif" }}
        {...rest}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type="button"
      className={`${base} border border-solid border-[#e8b600] bg-transparent text-[#e8b600] ${className}`}
      style={{ fontFamily: "Satoshi, sans-serif" }}
      {...rest}
    >
      {children}
    </button>
  );
}

function CommitmentCarousel() {
  const [index, setIndex] = useState(0);
  const next = useCallback(() => {
    setIndex((i) => (i + 1) % COMMITMENT_CARDS.length);
  }, []);
  const prev = useCallback(() => {
    setIndex(
      (i) => (i - 1 + COMMITMENT_CARDS.length) % COMMITMENT_CARDS.length,
    );
  }, []);

  const card = COMMITMENT_CARDS[index];

  return (
    <div className="relative mx-auto h-[414px] w-full max-w-[338px]">
      <div className="relative h-[338px] w-full overflow-hidden rounded-none">
        <img
          src={card.src}
          alt=""
          className="size-full object-cover"
        />
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col justify-end rounded-bl-[24px] rounded-br-[24px] p-[30px] pb-6"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0) 100%)",
          }}
        >
          <p
            className="mb-0 text-[16px] font-extrabold leading-[22px] text-[#e8b600]"
            style={{ fontFamily: "League Spartan, sans-serif" }}
          >
            {card.title}
          </p>
          <p
            className="mt-0 max-w-[278px] text-[16px] font-medium leading-[22px] text-white"
            style={{ fontFamily: "League Spartan, sans-serif" }}
          >
            {card.body}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {COMMITMENT_CARDS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i === index ? "bg-[#e8b600]" : "bg-[#d4d4d4]"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 right-0 flex gap-4">
        <button
          type="button"
          onClick={prev}
          className="flex items-center justify-center rounded-[30px] bg-[#f0f0f0] p-3.5 opacity-60"
          aria-label="Previous"
        >
          <ChevronLeft className="size-6 text-[#14141b]" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={next}
          className="flex items-center justify-center rounded-[30px] bg-[#f0f0f0] p-3.5"
          aria-label="Next"
        >
          <ChevronRight className="size-6 text-[#14141b]" strokeWidth={2} />
        </button>
      </div>

      <Link
        href="/register"
        className="absolute bottom-0 left-0 flex items-center justify-center rounded-[22px] bg-[#e8b600] px-6 py-2.5 text-[18px] font-bold capitalize text-[#fafafa]"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        Register now
      </Link>
    </div>
  );
}

function MadeForParentsPhones() {
  return (
    <div
      className="relative mx-auto h-[482px] w-full max-w-[354px]"
      style={{
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))",
      }}
    >
      <div className="absolute left-1/2 top-1/2 w-[201px] -translate-x-[calc(50%+52px)] -translate-y-1/2">
        <div className="relative h-[437px] w-[201px] overflow-hidden rounded-[14px] bg-[#14141b]">
          <img
            src={IMG_PHONE_DASH}
            alt=""
            className="absolute left-0 top-[58px] h-[320px] w-full object-cover object-top"
          />
        </div>
        <img
          src={IMG_PHONE_BEZEL}
          alt=""
          className="pointer-events-none absolute -left-3 -top-3 h-[460px] w-[225px] max-w-none object-cover"
        />
      </div>
      <div className="absolute left-1/2 top-1/2 w-[201px] -translate-x-[calc(50%-52px)] -translate-y-1/2">
        <div
          className="relative h-[437px] w-[201px] overflow-hidden rounded-[14px] bg-[#14141b]"
          style={{
            filter: "drop-shadow(-8px 0 13px rgba(0,0,0,0.2))",
          }}
        >
          <img
            src={IMG_PHONE_MAP}
            alt=""
            className="absolute left-0 top-[58px] h-[320px] w-full object-cover object-top"
          />
        </div>
        <img
          src={IMG_PHONE_BEZEL}
          alt=""
          className="pointer-events-none absolute -left-3 -top-3 h-[460px] w-[225px] max-w-none object-cover"
        />
      </div>
    </div>
  );
}

export default function HomePageView() {
  const router = useRouter();

  return (
    <div className={`${leagueSpartan.className} min-h-screen`}>
      <div className="fixed left-0 right-0 top-0 z-50 bg-[#14141b] md:bg-transparent">
        <Header />
      </div>

      <div className="mx-auto w-full max-w-[402px] bg-[#14141b] pb-12 pt-[72px] md:max-w-none md:pt-[128px]">
        {/* Hero (dark): mobile stacked; desktop two-column + bus enters from right */}
        <section className="bg-[#14141b] px-4 pb-8 pt-6 md:flex md:min-h-[min(560px,calc(100dvh-8rem))] md:items-center md:gap-10 md:px-12 md:pb-16 md:pt-10 lg:px-24">
          <div className="flex flex-col items-center gap-4 md:flex-1 md:items-start md:gap-6">
            <h1 className="text-center text-[28px] font-semibold leading-[38px] text-white md:text-left md:text-[clamp(2.5rem,4vw,3.5rem)] md:leading-[1.1]">
              <span className="block text-white md:text-[#e8b600]">
                Safe & Reliable
              </span>
              <span className="block">Student Transportation</span>
            </h1>
            <p
              className="hidden max-w-xl text-[17px] leading-[28px] text-white/90 md:block"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              We deliver safe, efficient, and reliable student transportation so
              you can focus on what matters most—your child&apos;s well-being.
            </p>
            <div className="hidden gap-5 md:flex">
              <MobileButton
                variant="fill"
                onClick={() => router.push("/register")}
              >
                Register Now
              </MobileButton>
              <MobileButton
                variant="outline"
                onClick={() => router.push("/about")}
              >
                Learn More
              </MobileButton>
            </div>
          </div>
          <div className="relative mx-auto mt-2 h-[189px] w-full max-w-[366px] md:mx-0 md:mt-0 md:flex md:h-[min(420px,52vh)] md:max-w-[52%] md:flex-1 md:items-center md:justify-end">
            <img
              src={IMG_SCHOOL_BUS}
              alt="Yellow school bus"
              className="mx-auto h-[152px] w-auto max-w-full object-contain md:mx-0 md:h-full md:max-h-[min(420px,52vh)] md:w-auto md:max-w-full md:object-contain md:home-hero-bus--desktop"
            />
          </div>
        </section>

        {/* Intro + CTAs (mobile only — desktop uses dark hero copy above) */}
        <section className="relative z-10 -mt-4 rounded-t-[24px] bg-white px-10 pb-10 pt-12 md:hidden">
          <div className="mx-auto flex max-w-[322px] flex-col gap-4">
            <p className="text-center text-[20px] font-medium leading-[28px] tracking-[0.4px] text-black">
              Ensuring your child&apos;s safe journey to school, every day.
            </p>
            <div className="flex flex-col gap-5">
              <p
                className="text-justify text-[16px] font-normal leading-[26px] tracking-[0.32px] text-[#0d0d0d]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                We deliver safe, efficient, and reliable transportation so you
                can focus on what matters most—your child&apos;s well-being
              </p>
              <div className="flex h-11 gap-6">
                <MobileButton
                  variant="fill"
                  onClick={() => router.push("/register")}
                >
                  Register Now
                </MobileButton>
                <MobileButton
                  variant="outline"
                  onClick={() => router.push("/about")}
                >
                  Learn More
                </MobileButton>
              </div>
            </div>
          </div>
        </section>

        {/* Your Child's Journey */}
        <section className="bg-white px-8 pb-12 pt-2 md:rounded-t-[32px] md:px-12 md:pb-20 md:pt-12 lg:px-20">
          <div className="mx-auto flex max-w-[338px] flex-col items-center gap-6 md:max-w-6xl">
            <h2 className="text-center text-[28px] font-semibold leading-[38px] text-[#0d0d0d] md:text-[clamp(2rem,3vw,2.75rem)] md:leading-tight">
              <span className="block">Your Child&apos;s Journey,</span>
              <span className="block text-[#0d0d0d] md:text-[#e8b600]">
                Our Commitment
              </span>
            </h2>
            <p
              className="hidden max-w-2xl text-center text-[17px] leading-[28px] text-[#0d0d0d] md:block"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              We take the responsibility of student transport seriously. With
              timely pickups, real-time updates, and a strong focus on safety,
              you can count on us every single day.
            </p>
            {/* Desktop: three feature images + caption + CTAs */}
            <div className="hidden w-full flex-col items-center gap-8 md:flex">
              <div className="flex w-full max-w-5xl items-end justify-center gap-5 lg:gap-8">
                {COMMITMENT_CARDS.map((card, i) => (
                  <div
                    key={card.title}
                    className={`relative overflow-hidden rounded-2xl shadow-lg ${
                      i === 1
                        ? "aspect-[4/5] w-[min(280px,28vw)] lg:w-[300px]"
                        : "aspect-[4/5] w-[min(220px,22vw)] lg:w-[240px]"
                    }`}
                  >
                    <img
                      src={card.src}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-[#e8b600]">
                  {COMMITMENT_CARDS[1].title}
                </p>
                <p
                  className="mx-auto mt-1 max-w-md text-[16px] text-[#0d0d0d]"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {COMMITMENT_CARDS[1].body}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-5">
                <MobileButton
                  variant="fill"
                  onClick={() => router.push("/register")}
                >
                  Register Now
                </MobileButton>
                <MobileButton
                  variant="outline"
                  onClick={() => router.push("/about")}
                >
                  Learn More
                </MobileButton>
              </div>
            </div>
            <div className="w-full md:hidden">
              <CommitmentCarousel />
            </div>
          </div>
        </section>

        {/* Made for Parents */}
        <section className="bg-white px-[22px] pb-12 pt-4 md:bg-[#fdfbf0] md:px-12 md:py-20 lg:px-24">
          <div className="mx-auto grid max-w-[357px] grid-cols-1 justify-items-center gap-6 md:max-w-6xl md:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] md:items-center md:gap-x-12 md:gap-y-8 md:justify-items-stretch lg:gap-x-16">
            <h2 className="text-center text-[28px] font-semibold leading-10 text-black md:col-start-1 md:row-start-1 md:text-left md:text-[clamp(2rem,3vw,2.75rem)] md:leading-tight">
              Made for{" "}
              <span className="text-black md:text-[#e8b600]">Parents</span>
            </h2>
            <div className="w-full md:col-start-2 md:row-start-1 md:row-span-2 md:flex md:justify-center md:self-center">
              <MadeForParentsPhones />
            </div>
            <div className="flex w-full max-w-[357px] flex-col gap-5 md:col-start-1 md:row-start-2 md:max-w-xl">
              <p
                className="text-justify text-[16px] leading-[26px] tracking-[0.32px] text-[#0d0d0d] md:text-left"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                A service built with the latest technology and tailored
                convenience. Designed to keep parents informed and students
                safe, every single day.
              </p>
              <div className="flex gap-6">
                <MobileButton
                  variant="fill"
                  onClick={() => router.push("/register")}
                >
                  Register Now
                </MobileButton>
                <MobileButton
                  variant="outline"
                  onClick={() => router.push("/about")}
                >
                  Learn More
                </MobileButton>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started Your Way */}
        <section className="bg-white px-6 pb-12 pt-4 md:px-12 md:pb-20 lg:px-24">
          <div className="mx-auto flex max-w-[354px] flex-col gap-6 md:max-w-4xl">
            <h2 className="px-3.5 text-center text-[22px] font-semibold leading-8 text-[#0d0d0d]">
              Get Started Your Way
            </h2>

            <div className="flex gap-4">
              <div className="relative h-[156px] w-[160px] shrink-0 overflow-hidden rounded-2xl bg-[#f5f5f5]">
                <img
                  src="/assets/step1.svg"
                  alt=""
                  className="size-full object-contain p-2"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center pt-2">
                <p className="text-[18px] font-semibold leading-[18px] text-[#0d0d0d]">
                  Register Online
                </p>
                <p
                  className="mt-[26px] text-[15px] leading-snug text-[#0d0d0d]"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  Create an account, enter your student&apos;s details, and
                  finalize your payment in a few quick and easy steps.
                </p>
              </div>
            </div>

            <p className="text-center text-[18px] font-medium text-[#0d0d0d]">
              OR
            </p>

            <div className="flex gap-4">
              <div className="relative h-[156px] w-[160px] shrink-0 overflow-hidden rounded-2xl bg-[#f5f5f5]">
                <img
                  src="/assets/viacall.svg"
                  alt=""
                  className="size-full object-contain p-4"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center pt-2">
                <p className="text-[18px] font-semibold leading-[18px] text-[#0d0d0d]">
                  Register by Call
                </p>
                <p
                  className="mt-[26px] text-[15px] leading-snug text-[#0d0d0d]"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  Just give us a call and our caring agent will take care of
                  every step, making registration stress-free.
                </p>
              </div>
            </div>

            <div className="flex gap-6 pt-2">
              <MobileButton
                variant="fill"
                className="max-w-[160px] flex-none"
                onClick={() => router.push("/register")}
              >
                Register Online
              </MobileButton>
              <a
                href="tel:+919979645635"
                className="flex h-11 min-h-0 min-w-0 max-w-[180px] flex-1 cursor-pointer items-center justify-center rounded-[22px] border border-solid border-[#e8b600] bg-transparent px-6 text-center text-[18px] font-bold capitalize leading-none text-[#e8b600] no-underline"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Call Us
              </a>
            </div>
          </div>
        </section>

        {/* Event & Group Transport */}
        <section className="bg-[#fafafa] px-8 py-10 md:px-12 lg:px-24">
          <div className="mx-auto max-w-[341px] text-center md:max-w-4xl">
            <h2 className="text-[26px] font-semibold leading-8 text-[#0d0d0d]">
              Event &amp; Group Transport Options
            </h2>
            <p
              className="mt-6 text-justify text-[16px] leading-[26px] tracking-[0.32px] text-[#0d0d0d]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Beyond our daily student transport, we also offer tailored bus
              rental solutions for special events and group travel.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl bg-[#e8e8e8]">
              <div className="aspect-[402/280] w-full bg-gradient-to-br from-[#2a2a33] to-[#14141b]" />
            </div>
          </div>
        </section>

        {/* Our Fleet */}
        <section className="bg-white px-8 py-10 md:px-12 lg:px-24">
          <h2 className="text-center text-[28px] font-semibold text-[#0d0d0d] md:text-3xl">
            Our Fleet
          </h2>
          <div className="mx-auto mt-8 flex max-w-[338px] flex-col gap-6 md:max-w-6xl md:grid md:grid-cols-3 md:gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="overflow-hidden rounded-2xl border border-[#eaeaea] bg-white shadow-md"
              >
                <div className="aspect-[338/200] w-full bg-gradient-to-t from-[#14141b] to-[#3d3d48]" />
                <div className="p-4">
                  <p className="text-[18px] font-bold text-[#0d0d0d]">
                    Modern buses
                  </p>
                  <p
                    className="mt-1 text-[14px] text-[#444]"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    Comfortable seating, safety equipment, and regular
                    maintenance.
                  </p>
                </div>
              </div>
            ))}
            <p
              className="col-span-full text-center text-[16px] leading-[24px] text-[#0d0d0d] md:max-w-3xl md:justify-self-center"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              In addition to our fleet, we offer the flexibility to arrange
              additional buses for larger groups.
            </p>
            <div className="col-span-full flex justify-center">
              <MobileButton
                variant="outline"
                className="max-w-[180px] flex-none"
                onClick={() => router.push("/school-transportation")}
              >
                Learn More
              </MobileButton>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#14141b] px-6 pb-10 pt-10 text-white md:px-12 lg:px-24">
          <div className="mx-auto flex max-w-[404px] flex-col md:max-w-6xl md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-10">
            <div className="flex items-center justify-between md:block md:min-w-[180px]">
              <img
                src="/assets/logo.svg"
                alt="Rukhiyas"
                width={70}
                height={46}
              />
              <button
                type="button"
                className="flex size-[52px] min-h-0 min-w-0 items-center justify-center p-0 md:hidden"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Scroll to top"
              >
                <img src="/Nav Buttons.svg" alt="" width={52} height={52} />
              </button>
            </div>
            <nav className="mt-6 flex flex-col md:mt-0 md:flex-1 md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:gap-y-2">
              <Link
                href="/about"
                className="border-b border-[#3a3a3a] py-4 text-[19px] font-normal text-white no-underline md:border-0 md:py-2"
              >
                About
              </Link>
              <Link
                href="/school-transportation"
                className="border-b border-[#3a3a3a] py-4 text-[19px] font-normal text-white no-underline md:border-0 md:py-2"
              >
                School Transport
              </Link>
              <Link
                href="/rentals-hire"
                className="border-b border-[#3a3a3a] py-4 text-[19px] font-normal text-white no-underline md:border-0 md:py-2"
              >
                Bus Rentals/Hire
              </Link>
              <a
                href="mailto:Rukhiyastransports@gmail.com"
                className="border-b border-[#3a3a3a] py-4 text-[19px] font-normal text-white no-underline md:border-0 md:py-2"
              >
                Contact Us
              </a>
              <span className="border-b border-[#3a3a3a] py-4 text-[19px] font-normal opacity-80 md:border-0 md:py-2">
                Terms &amp; Policies
              </span>
            </nav>
            <div className="mx-auto mt-8 flex gap-4 md:mx-0 md:mt-0 md:self-center">
              <img src="/linkedin.svg" alt="LinkedIn" width={40} height={40} />
              <img src="/facebook.svg" alt="Facebook" width={40} height={40} />
              <img src="/instagram.svg" alt="Instagram" width={40} height={40} />
            </div>
            <p className="mt-6 w-full text-center text-[13px] text-white/80 md:basis-full">
              © 2025. All Right Reserved
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
