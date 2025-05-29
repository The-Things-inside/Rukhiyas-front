import Header from "../components/Header";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#13131a] flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-end">
        <HeroSection />
      </main>
    </div>
  );
}
