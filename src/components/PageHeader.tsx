import Image from "next/image";
import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/app": "Dashboard",
  "/app/track": "Track Bus",
  "/app/notifications": "Notification",
  "/app/profile": "Profile",
};

export default function PageHeader() {
  const pathname = usePathname();
  const title = TITLES[pathname] || "";

  return (
    <header className="w-full bg-[#19191F] px-4 pt-4 pb-2 flex items-center justify-between max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <Image
          src="/assets/profile.svg"
          alt="Aryan"
          width={32}
          height={32}
          className="rounded-full bg-white"
        />
        <span className="text-white text-[16px] font-medium font-satoshi">
          Aryan
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="ml-1"
        >
          <path
            d="M7 10l5 5 5-5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-white text-[20px] font-medium font-satoshi">
        {title}
      </span>
    </header>
  );
}
