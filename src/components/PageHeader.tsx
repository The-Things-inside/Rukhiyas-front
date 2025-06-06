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
      </div>
      <span className="text-white text-[20px] font-medium font-satoshi">
        {title}
      </span>
    </header>
  );
}
