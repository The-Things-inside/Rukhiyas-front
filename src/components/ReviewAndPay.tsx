import React from "react";

interface StudentCard {
  id: string;
  studentName: string;
  class: string;
  division: string;
  school: string;
  homeAddress: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export default function ReviewAndPay({
  students,
}: {
  students: StudentCard[];
}) {
  return (
    <div className="p-6">
      <h2
        className="text-black text-[20px] text-center mb-4 font-bold"
        style={{ fontFamily: "Spartan, sans-serif", fontWeight: 600 }}
      >
        Review & Estimate
      </h2>
      <div className="text-black text-[16px] font-light pb-2">
        Student Details
      </div>
      {students.map((student) => (
        <div
          key={student.id}
          className="mb-4 p-4 rounded-2xl border border-yellow-400 shadow-sm"
        >
          <div className="mb-2">
            <span className="block text-gray-500 text-sm font-medium">
              Name
            </span>
            <span className="block text-black text-base font-medium">
              {student.studentName}
            </span>
          </div>
          <div className="flex gap-6 mb-2">
            <div>
              <span className="block text-gray-500 text-sm font-medium">
                Class
              </span>
              <span className="block text-black text-base font-medium">
                {student.class} {student.division}
              </span>
            </div>
            <div>
              <span className="block text-gray-500 text-sm font-medium">
                School
              </span>
              <span className="block text-black text-base font-medium">
                {student.school}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <span className="block text-gray-500 text-sm font-medium">
              Address
            </span>
            <span className="block text-black text-base font-medium">
              {student.homeAddress}
            </span>
          </div>
          <div className="flex gap-4 mt-2">
            <button className="bg-yellow-400 text-white font-semibold rounded-full py-2 px-8 text-base shadow hover:bg-yellow-500 transition w-1/2">
              Edit
            </button>
            <button className="border border-yellow-400 text-yellow-400 font-semibold rounded-full py-2 px-8 text-base bg-white hover:bg-yellow-50 transition w-1/2">
              Remove
            </button>
          </div>
        </div>
      ))}
      <button className="w-full border border-yellow-400 text-yellow-400 font-semibold rounded-full py-3 mt-2 text-lg bg-white hover:bg-yellow-50 transition">
        Add Another Student
      </button>
      <div className="mt-6 text-center">
        <button className="bg-[#eab308] text-white font-semibold rounded-full py-3 px-8 text-lg shadow hover:bg-[#c49c00] transition">
          Pay Now
        </button>
      </div>
    </div>
  );
}
