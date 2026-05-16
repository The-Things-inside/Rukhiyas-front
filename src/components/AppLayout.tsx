import { ReactNode } from "react";
import BottomNavBar from "./BottomNavBar";

interface AppLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export default function AppLayout({ children, header }: AppLayoutProps) {
  const headerHeight = header ? 64 : 0;
  const navHeight = 80;

  return (
    <div className="min-h-screen bg-[#19191F]">
      {header ? (
        <div className="fixed top-0 left-0 right-0 z-50">{header}</div>
      ) : null}
      <div
        className="fixed left-0 right-0 mx-auto bg-white rounded-t-[24px] max-w-md overflow-y-auto overscroll-contain"
        style={{
          top: headerHeight,
          bottom: `calc(${navHeight}px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <div className="min-h-full pb-8">{children}</div>
      </div>
      <BottomNavBar />
    </div>
  );
}
