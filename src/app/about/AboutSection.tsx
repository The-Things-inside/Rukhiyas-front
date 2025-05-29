import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomFooter from "./BottumFooter";

export default function AboutSection() {
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
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const boxVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <>
      <section className="bg-white rounded-t-3xl pt-8  px-5 md:min-h-screen flex flex-col items-center shadow-lg w-full max-w-md mx-auto md:max-w-full md:rounded-6xl md:pt-0 md:pb-0 md:px-0 md:flex-row md:items-stretch md:shadow-none">
        {/* Desktop layout: two columns */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start md:pl-64 md:pr-8 md:pt-0.5 md:py-0 py-8">
          {/* Heading */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-spartan text-center md:text-left mb-3 mt-2 heading-styles"
          >
            <span className="block md:hidden">About Rukhiyas</span>
            <span className="hidden md:block">About Rukhiyas</span>
          </motion.div>
          {/* Paragraph */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="font-satoshi mt-2 md:mt-6 md:mb-8 paragraph-styles"
          >
            {/* Mobile text */}
            <div className="block md:hidden">
              <p>
                Founded in 2002, Rukhiyas has been a trusted name in student
                transportation across Mahe for over two decades.
              </p>
              <p className="mt-2">
                Today, we proudly serve over 450 students from 7 different
                schools in Mahe, ensuring that every child reaches their
                destination securely and on time.
              </p>
            </div>
            {/* Desktop text */}
            <p className="hidden md:block">
              Founded in 2002 in Mahe, Rukhiyas began as a single school
              transport service with a vision to make student commutes safe and
              reliable. Over the past two decades, we&apos;ve grown steadily,
              now serving seven local schools and transporting over 450 students
              in and around Mahe each day. Our commitment to punctuality and
              personalized service has kept families happy for more than 20
              years.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 mt-6 md:mt-0"
          >
            <button
              className="bg-[#EAB308] font-satoshi text-white font-semibold rounded-full px-8 py-2 text-base shadow-none hover:bg-[#d1a106] transition-colors duration-200"
              onClick={handleRegister}
            >
              Get Started
            </button>
            <button className="border font-satoshi border-[#EAB308] text-[#EAB308] font-semibold rounded-full px-8 py-2 text-base bg-transparent shadow-none hover:bg-[#fffbe6] transition-colors duration-200">
              Learn More
            </button>
          </motion.div>
        </div>
        {/* Desktop image column */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="hidden md:flex w-1/2 items-center justify-center pr-24 md:mt-0"
        >
          <Image
            src="/assets/about-image.png"
            alt="About Rukhiyas"
            width={674}
            height={450}
            className="rounded-3xl object-cover"
          />
        </motion.div>
      </section>
      {/* Stats Section Inline */}
      <div className="bg-white " ref={statsRef}>
        <motion.section
          className="w-full flex flex-col items-center md:mt-0 mt-[38px] mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="w-[288px] h-[38px] md:w-[487px] md:h-[64px] font-spartan font-semibold text-[28px] md:text-[48px] leading-[38px] md:leading-[64px] tracking-[1px] md:tracking-[1px] text-black text-center mb-6 mx-auto"
            variants={titleVariants}
          >
            Numbers Say It All
          </motion.div>
          <motion.div
            className="flex flex-col md:flex-row gap-6 md:gap-2 justify-center w-full max-w-5xl"
            variants={containerVariants}
          >
            {/* Years of Experience */}
            <motion.div className="p-2" variants={boxVariants}>
              <div
                className="bg-white w-[288px] h-[169px] rounded-2xl flex flex-col items-center justify-center mx-auto"
                style={{
                  boxShadow:
                    "0 -2px 2px 0 #E8B600cc, 0 2px 4px 0 #E8B60066,  0 4px 8px 0 rgba(0, 0, 0, 0.15)",
                }}
              >
                <div className="flex items-center justify-center mb-1 gap-4">
                  <Image
                    src="/winner 1.svg"
                    alt="Years of Experience"
                    width={40}
                    height={40}
                  />
                  <div className="font-satoshi font-bold text-[40px] text-[#E8B600]">
                    23+
                  </div>
                </div>
                <div className="font-satoshi font-light text-[20px] text-[#6e6e6e]">
                  Years of Experience
                </div>
              </div>
            </motion.div>
            {/* Students on Board */}
            <motion.div className="p-2" variants={boxVariants}>
              <div
                className="bg-white w-[288px] h-[169px] rounded-2xl flex flex-col items-center justify-center mx-auto"
                style={{
                  boxShadow:
                    "0 -2px 2px 0 #E8B600cc, 0 2px 4px 0 #E8B60066,  0 4px 8px 0 rgba(0, 0, 0, 0.15)",
                }}
              >
                <div className="flex items-center justify-center mb-1 gap-4">
                  <Image
                    src="/studentsonboard.svg"
                    alt="Students on Board"
                    width={96}
                    height={40}
                  />
                  <div className="font-satoshi font-bold text-[40px] text-[#E8B600]">
                    450+
                  </div>
                </div>
                <div className="font-satoshi font-light text-[20px] text-[#6e6e6e]">
                  Students on Board
                </div>
              </div>
            </motion.div>
            {/* Schools Covered */}
            <motion.div className="p-2" variants={boxVariants}>
              <div
                className="bg-white w-[288px] h-[169px] rounded-2xl flex flex-col items-center justify-center mx-auto"
                style={{
                  boxShadow:
                    "0 -2px 2px 0 #E8B600cc, 0 2px 4px 0 #E8B60066,  0 4px 8px 0 rgba(0, 0, 0, 0.15)",
                }}
              >
                <div className="flex items-center justify-center mb-1 gap-4">
                  <Image
                    src="/schoolscoverd.svg"
                    alt="Schools Covered"
                    width={40}
                    height={40}
                  />
                  <div className="font-satoshi font-thin text-[40px] text-[#E8B600]">
                    Up to
                  </div>
                  <div className="font-satoshi font-bold text-[40px] text-[#E8B600]">
                    7
                  </div>
                </div>
                <div className="font-satoshi font-light text-[20px] text-[#6e6e6e]">
                  Schools Covered
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.button
            className="mt-8 w-[288px] md:w-[224px] h-[44px] bg-[#EAB308] font-satoshi font-bold text-[18px] text-[#fafafa] rounded-full px-10 py-3 text-lg shadow-md hover:bg-[#d1a106] transition-colors duration-200 flex flex-col items-center justify-center mx-auto"
            variants={buttonVariants}
            onClick={handleRegister}
          >
            Register Now
          </motion.button>
        </motion.section>
      </div>
      {/* Why Choose Us Section */}
      <WhyChooseUs />
    </>
  );
}

// Why Choose Us Accordion Section
const whyChooseUsData = [
  {
    question: "Built on Trust",
    answer:
      "For over 20 years, families in Mahe have trusted us to get their children to and from school safely and on time.That trust is what drives us, every single day.",
  },
  {
    question: "Safety Comes First",
    answer:
      "From well-maintained vehicles to trained and background-checked drivers, safety isn't just a feature-it's our foundation.",
  },
  {
    question: "Real-Time Updates",
    answer:
      "Stay in the loop with live tracking and instant alerts. Know exactly when your child is picked up, dropped off, or if there's a delay.",
  },
  {
    question: "Community-Centered Service",
    answer:
      "We're not just a transport provider-we're part of the neighborhood. Our strong ties with local schools and families help us serve you better.",
  },
  {
    question: "Always On Time",
    answer:
      "We take punctuality seriously. With carefully planned routes and experienced staff, we keep delays to a minimum and routines on track.",
  },
  {
    question: "Personal Support",
    answer:
      "Have a question or need to make a change? Our caring support team is just a call away and always ready to help.",
  },
];

function WhyChooseUs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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
      transition: { duration: 0.6, ease: "easeOut" },
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
          Why Choose Us?
        </motion.h2>
        <div className="w-[338px] h-[56px]max-w-md md:w-[984px] md:pt-1 flex flex-col gap-4">
          {whyChooseUsData.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={item.question}
                variants={itemVariants}
                className={`${isOpen ? "bg-[#ffffff]" : "bg-[#FFFCF1]"} rounded-xl`}
              >
                <button
                  className={`${isOpen ? "font-satoshi" : "font-jakarta"} w-full flex items-center justify-between px-6 py-4 text-left text-[16px] md:text-[24px] font-medium focus:outline-none`}
                  style={{
                    color: "#000",
                    letterSpacing: "6%",
                    fontWeight: 500,
                  }}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span
                    className="ml-4 text-[35px] text-[#000000] font-light transition-transform duration-200"
                    style={{ transform: isOpen ? "none" : "rotate(0deg)" }}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4 md:pt-10 font-light text-[16px] md:text-[18px] text-gray-400"
                    style={{ color: "#666", letterSpacing: "6%" }}
                  >
                    {item.answer}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
        <motion.div
          className="flex gap-4 mt-8 justify-center w-full"
          variants={itemVariants}
        >
          <button
            className="bg-[#EAB308] font-satoshi text-white font-semibold rounded-full px-8 py-2 text-base shadow-none hover:bg-[#d1a106] transition-colors duration-200"
            onClick={handleRegister}
          >
            Register Now
          </button>
          <button className="border font-satoshi border-[#EAB308] text-[#EAB308] font-semibold rounded-full px-8 py-2 text-base bg-transparent shadow-none hover:bg-[#fffbe6] transition-colors duration-200">
            Learn More
          </button>
        </motion.div>
      </motion.section>
      <BottomFooter />
    </>
  );
}
