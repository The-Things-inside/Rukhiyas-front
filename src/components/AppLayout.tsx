import { ReactNode } from "react";
import BottomNavBar from "./BottomNavBar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 pb-16">{children}</main>
      <BottomNavBar />
    </div>
  );
}
