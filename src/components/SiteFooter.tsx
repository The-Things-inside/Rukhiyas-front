"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useRouter } from "next/navigation";

export function DesktopSiteFooter() {
  const router = useRouter();

  return (
    <footer className="bg-white rounded-tl-[48px] rounded-tr-[48px]">
      <div className="relative mx-auto max-w-[1920px] pt-[160px] pb-[60px]">
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute left-1/2 top-[48px] -translate-x-1/2 h-[52px] w-[52px] rounded-[30px] bg-[#F0F0F0] grid place-items-center"
        >
          <span className="text-[20px] leading-none">↑</span>
        </button>

        <div className="flex flex-col items-center gap-[80px]">
          <div className="w-full px-[160px] flex items-center justify-center gap-[160px]">
            <button
              type="button"
              aria-label="Go to home"
              onClick={() => router.push("/")}
              className="shrink-0"
            >
              <Image
                src="/assets/Rukhiyas-desktop.svg"
                alt="RUKHIYAS"
                width={98}
                height={64}
              />
            </button>

            <nav className="flex-1">
              <div className="flex items-center justify-between">
                {[
                  { label: "About", href: "/about" },
                  { label: "Student Transport", href: "/school-transportation" },
                  { label: "Bus Rentals/Hire", href: "/rentals-hire" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Terms & Policies", href: "/terms" },
                ].map((x) => (
                  <button
                    key={x.label}
                    type="button"
                    onClick={() => router.push(x.href)}
                    className="py-[16px] font-bold font-[Satoshi] text-[16px] text-black"
                  >
                    {x.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="flex items-center gap-[16px]">
              <img
                src="/assets/home/desktop/footer-linkedin.svg"
                alt="LinkedIn"
                width={40}
                height={40}
              />
              <img
                src="/assets/home/desktop/footer-facebook.svg"
                alt="Facebook"
                width={40}
                height={40}
              />
              <img
                src="/assets/home/desktop/footer-instagram.svg"
                alt="Instagram"
                width={40}
                height={40}
              />
            </div>
          </div>

          <div className="font-bold font-[var(--font-spartan)] text-[12px] text-[#5E5E5E]">
            © 2025. All Right Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MobileSiteFooter() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-tl-[24px] rounded-tr-[24px] py-[40px] flex flex-col items-center gap-[24px]">
      <div className="w-full px-[24px] flex items-end justify-between">
        <button
          type="button"
          aria-label="Go to home"
          onClick={() => router.push("/")}
        >
          <Image src="/assets/logo.svg" alt="RUKHIYAS" width={70} height={46} />
        </button>
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

