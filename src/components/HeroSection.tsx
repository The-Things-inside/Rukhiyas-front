export default function HeroSection() {
  return (
    <section className="bg-white rounded-t-3xl pt-8 pb-12 px-5 min-h-[70vh] flex flex-col items-center shadow-lg w-full max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-center mb-3 mt-2">
        Ensuring your child&apos;s safe journey to school, every day.
      </h1>
      <p className="text-gray-600 text-center mb-6 text-sm max-w-xs">
        We deliver safe, efficient, and reliable transportation so you can focus
        on what matters most—your child&apos;s well-being
      </p>
      <div className="flex gap-4 mb-8">
        <button className="bg-[#f2c200] text-black font-semibold rounded-full px-6 py-2 text-sm shadow hover:bg-[#e6b800] transition">
          Register Now
        </button>
        <button className="border border-[#f2c200] text-[#f2c200] font-semibold rounded-full px-6 py-2 text-sm hover:bg-[#fffbe6] transition">
          Learn More
        </button>
      </div>
      <h2 className="text-lg font-bold text-center mt-8 mb-2">
        Your Child&apos;s Journey, Our Commitment
      </h2>
      {/* Add more details/content here as needed, and make the section scrollable if content overflows */}
      <div className="overflow-y-auto max-h-[40vh] w-full px-2">
        {/* Example content, replace with real details */}
        <ul className="list-disc text-gray-700 text-sm pl-5 space-y-2">
          <li>Real-time bus tracking for parents</li>
          <li>Instant notifications for arrivals and delays</li>
          <li>Secure and reliable drivers</li>
          <li>Easy student registration and management</li>
        </ul>
      </div>
    </section>
  );
}
