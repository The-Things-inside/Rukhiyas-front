"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { name: "Home", path: "/app", icon: "/assets/home.svg" },
  { name: "Profile", path: "/app/profile", icon: "/assets/profile.svg" },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#19191F] border-t border-gray-800 z-50 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex flex-1 flex-col items-center justify-center h-full"
              >
                <div
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                    isActive ? "bg-[#e8b600]/15" : ""
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={28}
                    height={28}
                    className={
                      isActive
                        ? "filter brightness-150 sepia-[1] hue-rotate-[20deg] saturate-[8] drop-shadow-[0_0_4px_#f2c200]"
                        : "opacity-80"
                    }
                  />
                  <span
                    className={`mt-1 whitespace-nowrap ${
                      isActive
                        ? "text-[#e8b600] font-bold"
                        : "text-[#ebebeb] font-medium"
                    }`}
                    style={{ fontFamily: "Satoshi, sans-serif", fontSize: 12 }}
                  >
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
