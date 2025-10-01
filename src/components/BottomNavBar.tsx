"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { name: "Home", path: "/app", icon: "/assets/home.svg" },
  { name: "Track Bus", path: "/app/track", icon: "/assets/trackbus.svg" },
  {
    name: "Notification",
    path: "/app/notifications",
    icon: "/assets/notification.svg",
    badge: true,
  },
  { name: "Profile", path: "/app/profile", icon: "/assets/profile.svg" },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#19191F] border-t border-gray-800 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex-1 flex flex-col items-center justify-center h-full relative"
              >
                <div
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                    isActive && item.name === "Profile"
                      ? "bg-[#e8b600]/15"
                      : ""
                  }`}
                >
                  <span className="relative flex items-center justify-center">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={28}
                      height={28}
                      className={
                        isActive && item.name === "Profile"
                          ? "filter brightness-150 sepia-[1] hue-rotate-[20deg] saturate-[8] drop-shadow-[0_0_4px_#f2c200] text-[#e8b600]"
                          : "opacity-80"
                      }
                    />
                    {item.badge && item.name === "Notification" && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#f2c200] rounded-full border-2 border-[#19191F]" />
                    )}
                  </span>
                  <span
                    className={`mt-1 whitespace-nowrap ${
                      isActive && item.name === "Profile"
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
