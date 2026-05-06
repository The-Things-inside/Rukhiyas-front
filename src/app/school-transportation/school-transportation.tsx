/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomFooter from "./BottumFooter";
import { useState } from "react";
import SimpleStepsToJoin from "./SimpleStepsToJoin";
import dynamic from "next/dynamic";

// Move this to the top of your file, outside any component:
const allSchools = [
  "St. Mary's High School",
  "Delhi Public School",
  "Kendriya Vidyalaya",
  "Modern Public School",
  "Springdales School",
];

// Custom dropdown for school selection
function SchoolDropdown({
  schools,
  onSelect,
}: {
  schools: string[];
  onSelect: (school: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <input
        className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] cursor-pointer ${value ? "text-gray-900" : "text-gray-400"}`}
        placeholder="Select School"
        value={value}
        readOnly
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <img
          src="/down.svg"
          alt="dropdown"
          className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {schools.map((school, idx) => (
            <div key={school}>
              <button
                className="w-full text-left px-4 py-3 text-gray-900 hover:bg-[#faf9f6] focus:bg-[#faf9f6] rounded-xl transition-colors duration-150"
                style={{
                  borderRadius:
                    idx === 0
                      ? "12px 12px 0 0"
                      : idx === schools.length - 1
                        ? "0 0 12px 12px"
                        : undefined,
                }}
                onClick={() => {
                  setValue(school);
                  setOpen(false);
                  onSelect(school);
                }}
                type="button"
              >
                {school}
              </button>
              {idx < schools.length - 1 && (
                <div className="h-px bg-gray-200 mx-4" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DynamicMapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
});

export default function SchoolTransportation() {
  const router = useRouter();

  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const buttonVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const boxVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const handleAboutUs = () => {
    router.push("/about");
  };

  return (
    <>
      {/* Mobile stays unchanged */}
      <section className="md:hidden bg-white rounded-t-3xl pt-8 px-5 flex flex-col items-center shadow-lg w-full max-w-md mx-auto">
        <div className="w-full flex flex-col justify-center items-center py-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="font-spartan text-center mb-10 mt-2 heading-styles"
          >
            <p>Smart & Secure</p>
            <p>School Commute</p>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1] as const,
              delay: 0.2,
            }}
            className="font-satoshi mt-2 paragraph-styles"
          >
            <p>
              At Rukhiyas, our student transportation service is engineered for
              your child&apos;s daily journey. Using cutting-edge GPS tracking,
              dedicated drivers, and flexible route management, we ensure every
              ride is punctual, secure, and stress-free.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 mt-6"
          >
            <button
              className="bg-[#EAB308] font-satoshi text-white font-semibold rounded-full px-8 py-2 text-base shadow-none hover:bg-[#d1a106] transition-colors duration-200"
              onClick={handleRegister}
            >
              Register Now
            </button>
            <button
              className="border font-satoshi border-[#EAB308] text-[#EAB308] font-semibold rounded-full px-8 py-2 text-base bg-transparent shadow-none hover:bg-[#fffbe6] transition-colors duration-200"
              onClick={handleAboutUs}
            >
              About Us
            </button>
          </motion.div>
        </div>
      </section>

      {/* Desktop (Figma node 1:18779) */}
      <section className="hidden md:block bg-white pb-[100px]">
        <div className="mx-auto max-w-[1920px] px-[240px]">
          <div className="flex items-center gap-[48px] w-full">
            <div className="flex flex-1 flex-col gap-[48px] min-w-0">
              <div className="flex flex-col gap-[24px] text-black">
                <motion.h1
                  initial={{ opacity: 0, y: -150 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                  className="font-bold font-[var(--font-spartan)] text-[48px] leading-[64px] w-[498px]"
                >
                  <span className="text-[#E8B600]">Smart &amp; Secure</span>
                  <span>{` School Commute`}</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1] as const,
                    delay: 0.2,
                  }}
                  className="font-[Satoshi] text-[18px] leading-[26px] tracking-[0.36px] text-justify w-[718px]"
                >
                  At Rukhiyas, our student transportation service is engineered
                  for your child&apos;s daily journey. Using cutting-edge GPS
                  tracking, dedicated drivers, and flexible route management, we
                  ensure every ride is punctual, secure, and stress-free.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1] as const,
                  delay: 0.35,
                }}
                className="flex gap-[10px]"
              >
                <button
                  className="h-[44px] w-[244px] rounded-[22px] bg-[#E8B600] px-[24px] py-[10px] font-bold font-[Satoshi] text-[18px] text-[#FAFAFA] capitalize"
                  onClick={handleRegister}
                >
                  register now
                </button>
                <button
                  className="h-[44px] w-[244px] rounded-[22px] border border-[#E8B600] px-[24px] py-[10px] font-bold font-[Satoshi] text-[18px] text-[#E8B600] capitalize"
                  onClick={handleAboutUs}
                >
                  About Us
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1] as const,
                delay: 0.3,
              }}
              className="w-[674px] h-[450px] rounded-[32px] overflow-hidden shrink-0"
            >
              <Image
                src="/assets/school-transportation/desktop/hero.jpg"
                alt=""
                width={674}
                height={450}
                className="h-full w-full object-cover rounded-[32px]"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Desktop-only remaining sections (Figma nodes 1:18882 / 1:18913 / 1:18962 / 1:18987) */}
      <DesktopSections onRegister={handleRegister} />

      {/* Mobile-only remainder stays unchanged */}
      <div className="md:hidden">
        {/* Stats Section Inline */}
        <div className="bg-white " ref={statsRef}>
          <motion.section
            className="w-full flex flex-col items-center md:mt-0 mt-[38px] mb-0"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              className="w-[288px] h-[38px] md:w-[487px] md:h-[64px] font-spartan font-semibold text-[28px] md:text-[48px] leading-[38px] md:leading-[64px] tracking-[1px] md:tracking-[1px] text-black text-center mb-10 mx-auto"
              variants={titleVariants}
            >
              <p>All-In-One</p>
              <p>Control Center</p>
            </motion.div>

            <motion.div className="p-2" variants={boxVariants}>
              <div>
                <Image
                  src="/assets/Dashboard Anim.png"
                  alt="admin dashboard"
                  width={230}
                  height={0}
                />
              </div>
            </motion.div>
            <div className="font-satoshi  mt-2 md:mt-6 paragraph-styles">
              <p>
                Track your child&apos;s bus live, manage pickups and drop-offs,
                stay updated with real-time ride statuses, and handle payments,
                all in one place.
              </p>
            </div>
            <motion.button
              className=" w-[288px] -mt-9 md:w-[224px] h-[44px] bg-[#EAB308] font-satoshi font-bold text-[18px] text-[#fafafa] rounded-full   text-lg shadow-md hover:bg-[#d1a106] transition-colors duration-200 flex  items-center justify-center"
              variants={buttonVariants}
              onClick={handleRegister}
            >
              Register Now
            </motion.button>
          </motion.section>
        </div>
        {/* Why Choose Us Section */}
        <WhyChooseUs />
      </div>
    </>
  );
}

function WhyChooseUs() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };
  const router = useRouter();

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <>
      <motion.section
        ref={sectionRef}
        className="w-full md:pt-40 flex flex-col items-center bg-white md:min-h-[400px] py-8 px-2 md:px-0 pb-0"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2
          className="font-spartan font-bold text-[28px] md:text-[48px] leading-[38px] md:leading-[64px] tracking-[1px] md:tracking-[1px] text-black text-center mb-6"
          variants={itemVariants}
        >
          <div>
            <p>Area & Schools </p>
            <p>We Cover</p>
          </div>
        </motion.h2>
        <div className="font-satoshi text-black text-[16px] text-center  mt-2 md:mt-6 ">
          <div>
            <p>Search for your school or area to see if our </p>
            <p>service is available to you.</p>
          </div>
        </div>

        <section className="w-full px-4 md:px-8 mt-6">
          <SearchBar onSchoolSelect={setSelectedSchool} />
          <div
            className="w-full h-[405px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg"
            style={{ zIndex: 1 }}
          >
            <DynamicMapComponent selectedSchool={selectedSchool} />
          </div>

          {/* School List */}
        </section>
        <motion.div
          className="flex pl-4 mt-6 justify-center "
          variants={itemVariants}
          style={{ width: "354px", height: "44px" }}
        >
          <button
            className="bg-[#EAB308] font-satoshi text-white font-bold rounded-full px-8 py-2 text-[18px] shadow-none w-full hover:bg-[#d1a106] transition-colors duration-200"
            onClick={handleRegister}
          >
            Register Now
          </button>
        </motion.div>
      </motion.section>
      <motion.div className="w-full max-w-md mx-auto px-4 md:px-8 mt-15">
        <p className="font-spartan font-semibold text-[28px] md:text-[40px] leading-[38px] md:leading-[64px] tracking-[1px] md:tracking-[1px] text-black text-center mb-10">
          Get Your Fee Estimate
        </p>
        <div className="font-satoshi text-black-100 mt-2 md:mt-6 leading-tight paragraph-styles -mb-19">
          <p>
            Simply select your school and enter your home address to instantly
            reveal your personalized fee estimate.
          </p>
        </div>
        <div className=" max-w-sm mx-auto">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            School
          </label>
          <SchoolDropdown
            schools={[
              "St. Mary's High School",
              "Delhi Public School",
              "Kendriya Vidyalaya",
              "Modern Public School",
              "Springdales School",
            ]}
            onSelect={() => {}}
          />
        </div>
        <div className=" max-w-sm mx-auto">
          <label className="block text-sm font-medium text-gray-900 mb-1 mt-3">
            Sudent Address
          </label>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400"
            placeholder="Enter student address"
          />
        </div>
        <button className="bg-[#EAB308] font-satoshi text-white font-bold rounded-full px-8 py-2 text-[18px] shadow-none w-full hover:bg-[#d1a106] transition-colors duration-200 mt-6">
          Get Quote
        </button>
        <SimpleStepsToJoin />
      </motion.div>

      <BottomFooter />
    </>
  );
}

function DesktopSections({ onRegister }: { onRegister: () => void }) {
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [stepsTab, setStepsTab] = useState<"online" | "call">("online");

  return (
    <section className="hidden md:block bg-[#FFFCF1]">
      {/* Control center (1:18882) */}
      <div className="mx-auto max-w-[1920px] px-[240px] py-[100px]">
        <div className="flex items-center justify-center gap-[124px]">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative h-[487px] w-[224px] shrink-0 drop-shadow-[0px_6.686px_11.144px_rgba(0,0,0,0.25)]"
          >
            <div className="absolute inset-[14px_12px_14px_12px] rounded-[18px] overflow-hidden bg-[#14141B]">
              <Image
                src="/assets/school-transportation/desktop/dashboard-screen.png"
                alt=""
                fill
                className="object-cover"
                sizes="224px"
                priority={false}
              />
            </div>
            <Image
              src="/assets/school-transportation/desktop/iphone-bezel.png"
              alt=""
              fill
              className="object-cover pointer-events-none"
              sizes="224px"
              priority={false}
            />
          </motion.div>

          <div className="flex flex-col items-center gap-[48px] text-black">
            <div className="flex flex-col gap-[24px] w-[681px]">
              <motion.h2
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                className="font-bold font-[var(--font-spartan)] text-[48px] leading-[64px]"
              >
                <span className="text-[#E8B600]">All-In-One</span>
                <span>{` Control Center`}</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1] as const,
                  delay: 0.05,
                }}
                className="font-[Satoshi] text-[18px] leading-[26px] tracking-[0.36px]"
              >
                Track your child’s bus live, manage pickups and drop-offs, stay
                updated with real-time ride statuses, and handle payments, all in
                one place.
              </motion.p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="h-[44px] w-[244px] rounded-[22px] bg-[#E8B600] px-[24px] py-[10px] font-bold font-[Satoshi] text-[18px] text-[#FAFAFA] capitalize"
              onClick={onRegister}
            >
              Register Now
            </motion.button>
          </div>
        </div>
      </div>

      {/* Area & schools (1:18913) */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1920px] px-[240px] py-[100px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col items-center"
          >
            <h2 className="font-bold font-[var(--font-spartan)] text-[48px] leading-[64px] text-black text-center">
              <span className="text-[#E8B600]">Area &amp; Schools</span>
              <span>{` We Cover`}</span>
            </h2>
            <p className="mt-[12px] font-[Satoshi] text-[18px] leading-[26px] tracking-[0.36px] text-black text-center">
              Search for your school or area to see if our service is available
              to you.
            </p>

            <div className="mt-[32px] w-full max-w-[1440px]">
              {/* keep existing component (functionality) but sized to desktop */}
              <div className="mx-auto w-full max-w-[560px]">
                <SearchBar onSchoolSelect={setSelectedSchool} />
              </div>

              <div className="mt-[24px]">
                <DynamicMapComponent
                  selectedSchool={selectedSchool}
                  containerClassName="w-full h-[638px] rounded-[38px] overflow-hidden shadow-[0px_108.696px_29.931px_rgba(0,0,0,0),0px_69.314px_28.356px_rgba(0,0,0,0.01),0px_39.383px_23.63px_rgba(0,0,0,0.02),0px_17.328px_17.328px_rgba(0,0,0,0.03),0px_4.726px_9.452px_rgba(0,0,0,0.04)]"
                  mapClassName="h-full w-full"
                />
              </div>

              <div className="mt-[28px] flex justify-center">
                <button
                  className="h-[44px] w-[244px] rounded-[22px] bg-[#E8B600] px-[24px] py-[10px] font-bold font-[Satoshi] text-[18px] text-[#FAFAFA] capitalize"
                  onClick={onRegister}
                >
                  Register Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fee estimate (1:18962) */}
      <div className="mx-auto max-w-[1920px] px-[240px] py-[100px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto w-full max-w-[570px] flex flex-col items-center gap-[48px]"
        >
          <div className="w-full text-black">
            <h2 className="font-bold font-[var(--font-spartan)] text-[48px] leading-[64px]">
              <span>{`Get Your `}</span>
              <span className="text-[#E8B600]">Fee Estimate</span>
            </h2>
            <p className="mt-[24px] font-[Satoshi] text-[18px] leading-[26px] tracking-[0.36px]">
              Simply select your school and enter your home address to instantly
              reveal your personalized fee estimate.
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-[16px]">
            <div className="w-full flex flex-col gap-[16px]">
              <div className="w-full">
                <label className="block font-[Satoshi] font-medium text-[16px] leading-[1.4] text-black mb-[4px]">
                  School
                </label>
                <SchoolDropdown schools={allSchools} onSelect={() => {}} />
              </div>
              <div className="w-full">
                <label className="block font-[Satoshi] font-medium text-[16px] leading-[1.4] text-black mb-[4px]">
                  Student Address
                </label>
                <input
                  className="w-full border border-[#AAA] rounded-[12px] px-[16px] py-[20px] text-[16px] leading-none bg-white placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#E8B600]"
                  placeholder="Enter student address"
                />
              </div>
            </div>

            <button
              className="h-[44px] w-[244px] rounded-[22px] bg-[#E8B600] px-[24px] py-[10px] font-bold font-[Satoshi] text-[18px] text-[#FAFAFA] capitalize"
              type="button"
            >
              Get Quote
            </button>
          </div>
        </motion.div>
      </div>

      {/* Simple steps to join (1:18987) */}
      <div className="bg-[#14141B]">
        <div className="mx-auto max-w-[1920px] px-[240px] py-[100px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="mx-auto w-full max-w-[1440px] text-white"
          >
            <h2 className="text-center font-semibold font-[var(--font-spartan)] text-[48px] leading-[64px]">
              Simple Steps to Join
            </h2>

            <div className="mt-[36px] flex items-center justify-center gap-[80px] text-[18px] font-[Satoshi]">
              <button
                className={`pb-[10px] border-b-2 ${stepsTab === "online" ? "text-[#E8B600] border-[#E8B600]" : "text-[#7C7C7C] border-transparent"}`}
                onClick={() => setStepsTab("online")}
              >
                Register Online
              </button>
              <button
                className={`pb-[10px] border-b-2 ${stepsTab === "call" ? "text-[#E8B600] border-[#E8B600]" : "text-[#7C7C7C] border-transparent"}`}
                onClick={() => setStepsTab("call")}
              >
                Register Via Call
              </button>
            </div>

            <div className="mt-[52px] grid grid-cols-2 gap-x-[120px] gap-y-[56px]">
              {(stepsTab === "online"
                ? [
                    {
                      n: 1,
                      title: "Sign Up",
                      desc: 'Click "Register now" and create an account.',
                      img: "/assets/step1.svg",
                    },
                    {
                      n: 2,
                      title: "Enroll Student",
                      desc: "Fill all the required details of the student.",
                      img: "/assets/step2.svg",
                    },
                    {
                      n: 3,
                      title: "Review & Pay",
                      desc: "Confirm details and make a payment online.",
                      img: "/assets/step3.svg",
                    },
                    {
                      n: 4,
                      title: "Booking Confirmation",
                      desc: "Receive confirmation via SMS or WhatsApp after payment.",
                      img: "/assets/step4.svg",
                    },
                  ]
                : [
                    {
                      n: 1,
                      title: "Call Us",
                      desc: "Call our support team to begin registration.",
                      img: "/assets/step1.svg",
                    },
                    {
                      n: 2,
                      title: "Share Details",
                      desc: "Provide student and pickup details over the call.",
                      img: "/assets/step2.svg",
                    },
                    {
                      n: 3,
                      title: "Confirm Plan",
                      desc: "We confirm route availability and fees.",
                      img: "/assets/step3.svg",
                    },
                    {
                      n: 4,
                      title: "Activation",
                      desc: "Get confirmation via SMS/WhatsApp once activated.",
                      img: "/assets/step4.svg",
                    },
                  ]
              ).map((s) => (
                <div key={`${stepsTab}-${s.n}`} className="flex items-start gap-[28px]">
                  <div className="relative h-[156px] w-[160px] shrink-0">
                    <Image src={s.img} alt="" fill className="object-contain" />
                  </div>
                  <div className="pt-[10px]">
                    <div className="mb-[12px] inline-flex h-[32px] w-[32px] items-center justify-center rounded-full border-2 border-[#E8B600] text-[#E8B600] font-bold font-[Satoshi]">
                      {s.n}
                    </div>
                    <div className="font-bold font-[Satoshi] text-[20px] leading-[28px]">
                      {s.title}
                    </div>
                    <div className="mt-[8px] font-[Satoshi] text-[18px] leading-[26px] text-[#D1D1D1]">
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-[56px] flex items-center justify-center gap-[32px]">
              <button
                className="h-[44px] w-[244px] rounded-[22px] bg-[#E8B600] px-[24px] py-[10px] font-bold font-[Satoshi] text-[18px] text-[#FAFAFA] capitalize"
                onClick={onRegister}
              >
                Register Online
              </button>
              <button
                className="h-[44px] w-[244px] rounded-[22px] border border-[#E8B600] px-[24px] py-[10px] font-bold font-[Satoshi] text-[18px] text-[#E8B600] capitalize"
                type="button"
              >
                Register Via Call
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- SearchBar Component ---
function SearchBar({
  onSchoolSelect,
}: {
  onSchoolSelect: (school: string | null) => void;
}) {
  const [active, setActive] = useState<null | "school" | "area">(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query && active === "school") {
      const filtered = allSchools.filter((school) =>
        school.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, active]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (school: string) => {
    setQuery(school);
    setShowSuggestions(false);
    onSchoolSelect(school);
  };

  const handleClearSearch = () => {
    setActive(null);
    setQuery("");
    setShowSuggestions(false);
    onSchoolSelect(null);
  };

  return (
    <div
      className="flex items-center justify-center gap-2 mb-6 relative"
      ref={searchRef}
    >
      {active === null ? (
        <>
          <button
            className="w-[137px] h-12 px-2 border border-[#EAB308] rounded-l-full rounded-r-full bg-white text-gray-600 font-inter text-[14px] focus:outline-none transition-colors duration-150 hover:bg-[#fffbe6] whitespace-nowrap border-r-0 mr-1 sm:mr-0"
            style={{ zIndex: 1 }}
            onClick={() => setActive("school")}
          >
            Search school
          </button>
          <button
            className="w-[139px] h-12 px-2 border border-[#EAB308] rounded-l-full rounded-r-full bg-white text-gray-600 font-inter focus:outline-none transition-colors duration-150 hover:bg-[#fffbe6] whitespace-nowrap -ml-px sm:ml-0 text-[14px]"
            style={{ zIndex: 1 }}
            onClick={() => setActive("area")}
          >
            Search area
          </button>
        </>
      ) : (
        <div className="relative w-[278px]">
          <input
            autoFocus
            type="text"
            className="w-full h-12 pl-4 pr-14 border border-[#EAB308] rounded-l-full rounded-r-full focus:outline-none focus:ring-0 focus:ring-[#EAB308] text-gray-700 font-satoshi text-base bg-[#FFF8E1] transition-all duration-200 placeholder-gray-500"
            placeholder={
              active === "school"
                ? "Enter your school name"
                : "Enter your area name"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ zIndex: 20 }}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#EAB308] hover:text-yellow-700 focus:outline-none"
            onClick={handleClearSearch}
            aria-label="Close search"
            tabIndex={0}
            style={{ zIndex: 21 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              className="absolute w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto"
              style={{
                zIndex: 9999,
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
              }}
            >
              {suggestions.map((school, index) => (
                <div key={index} className="w-full">
                  <div
                    className="px-4 py-2 hover:bg-[#FFF8E1] cursor-pointer text-gray-700 font-satoshi w-full"
                    onClick={() => handleSuggestionClick(school)}
                  >
                    {school}
                  </div>
                  {/* Updated divider with full width */}
                  {index < suggestions.length - 1 && (
                    <div className="h-[1px] bg-gray-200 w-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Search icon */}
      <button
        className="w-15 h-12 flex items-center justify-center rounded-full bg-[#EAB308] border border-[#EAB308] text-white focus:outline-none"
        aria-label="Search"
        tabIndex={-1}
        style={{ pointerEvents: "none", zIndex: 20 }}
      >
        <svg
          className="h-10 w-10 sm:h-8 sm:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}
