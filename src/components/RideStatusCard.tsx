import Image from "next/image";

export default function RideStatusCard() {
  return (
    <div
      className="bg-white rounded-[20px] shadow-lg p-4 w-full mx-auto border border-gray-200"
      style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-black text-[18px] font-semibold pt-2 pb-2"
          style={{ fontFamily: "Spartan, sans-serif" }}
        >
          Ride Status
        </span>
        <span
          className="text-gray-500 text-[16px] font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          On Time
        </span>
      </div>
      {/* First status row */}
      <div className="flex items-center mb-2 gap-2">
        <Image src="/assets/homeicon.svg" alt="Home" width={28} height={28} />
        <span
          className="text-gray-700 text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Picked Up
        </span>
        <span className="flex-1" />
        <span
          className="text-gray-700 text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          7:30 AM
        </span>
      </div>
      <div className="h-4 border-l-2 border-dotted border-gray-300 ml-[14px] mb-2" />
      <div className="flex items-center mb-2 gap-2">
        <Image src="/assets/school.svg" alt="School" width={28} height={28} />
        <span
          className="text-gray-400 text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Arrived
        </span>
        <span className="flex-1" />
        <span
          className="text-gray-400 text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          8:00 AM
        </span>
      </div>
      <hr className="my-6 border-gray-200" />
      {/* Second status row */}
      <div className="flex items-center mb-2 gap-2">
        <Image src="/assets/homeicon.svg" alt="Home" width={28} height={28} />
        <span
          className="text-[#E8B600] text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Picked Up
        </span>
        <span className="flex-1" />
        <span
          className="text-[#E8B600] text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          3:30 AM
        </span>
      </div>
      <div className="h-4 border-l-2 border-dotted border-gray-300 ml-[14px] mb-2" />
      <div className="flex items-center mb-4 gap-2">
        <Image src="/assets/school.svg" alt="School" width={28} height={28} />
        <span
          className="text-gray-400 text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Expected
        </span>
        <span className="flex-1" />
        <span
          className="text-gray-400 text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          4:00 AM
        </span>
      </div>
      <button
        className="w-full border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-1 pb-2 text-[18px] mt-1 hover:bg-[#fffbe6] transition"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        Call Driver
      </button>
    </div>
  );
}
