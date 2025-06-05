"use client";

import { useForm } from "react-hook-form";
import SchoolDropdown from "./SchoolDropdown";
import { useState } from "react";
import dynamic from "next/dynamic";
import useHydrated from "../hooks/useHydrated";

interface FormValues {
  studentName: string;
  class: string;
  division: string;
  school: string;
  homeAddress: string;
}

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

const MapAddressPicker = dynamic(() => import("./MapAddressPicker"), {
  ssr: false,
});

interface StudentDetailsFormProps {
  onContinue: (students: StudentCard[]) => void;
  students: StudentCard[];
  setStudents: React.Dispatch<React.SetStateAction<StudentCard[]>>;
}

export default function StudentDetailsForm({
  onContinue,
  students,
  setStudents,
}: StudentDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>();

  const schoolValue = watch("school");
  const [mapOpen, setMapOpen] = useState(false);
  const homeAddress = watch("homeAddress");
  const hydrated = useHydrated();

  const onSubmit = (data: FormValues) => {
    const newStudent: StudentCard = {
      id: hydrated ? Date.now().toString() : "ssr-id",
      ...data,
    };
    setStudents([...students, newStudent]);
    reset(); // Reset form after adding student
  };

  const handleContinue = () => {
    if (students.length === 0) {
      console.log("No students added yet");
      return;
    }
    onContinue(students);
  };

  const StudentCard = ({ student }: { student: StudentCard }) => (
    <div className="bg-white rounded-xl p-4 shadow-md mb-4 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-900">
          {student.studentName}
        </h3>
        <button
          onClick={() =>
            setStudents(students.filter((s) => s.id !== student.id))
          }
          className="text-gray-400 hover:text-red-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div>
          <span className="font-medium">Class:</span> {student.class}
        </div>
        <div>
          <span className="font-medium">Division:</span> {student.division}
        </div>
        <div className="col-span-2">
          <span className="font-medium">School:</span> {student.school}
        </div>
        <div className="col-span-2">
          <span className="font-medium">Address:</span> {student.homeAddress}
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-6 pt-2">
      {students.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Added Students
          </h3>
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <h2
          className="text-xl font-bold text-black text-center mt-2 mb-1"
          style={{ fontFamily: "Spartan, sans-serif" }}
        >
          Student Details
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Full Name
          </label>
          <input
            {...register("studentName", {
              required: "Student name is required",
            })}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-black"
            placeholder="Enter student's full name"
          />
          {errors.studentName && (
            <span className="text-xs text-red-500">
              {errors.studentName.message}
            </span>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Class
            </label>
            <input
              {...register("class", { required: "Class is required" })}
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-black"
              placeholder="Enter class"
            />
            {errors.class && (
              <span className="text-xs text-red-500">
                {errors.class.message}
              </span>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Division
            </label>
            <input
              {...register("division", { required: "Division is required" })}
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-black"
              placeholder="Enter division"
            />
            {errors.division && (
              <span className="text-xs text-red-500">
                {errors.division.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            School
          </label>
          <SchoolDropdown
            value={schoolValue}
            onChange={(value) => setValue("school", value)}
            error={errors.school?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Home Address
          </label>
          <button
            type="button"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-black text-left flex items-center gap-2"
            onClick={() => setMapOpen(true)}
          >
            <svg
              className="w-5 h-5 mr-2 text-[#EAB308]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z"
              />
            </svg>
            {homeAddress ? (
              <span className="truncate flex-1">{homeAddress}</span>
            ) : (
              <span className="text-gray-400 flex-1">Select on map</span>
            )}
          </button>
          {errors.homeAddress && (
            <span className="text-xs text-red-500">
              {errors.homeAddress.message}
            </span>
          )}
          {mapOpen && (
            <MapAddressPicker
              open={mapOpen}
              onClose={() => setMapOpen(false)}
              onConfirm={(address, latlng) => {
                setValue("homeAddress", address, { shouldValidate: true });
                // Store the lat/lng in the current student's data
                const currentStudent = students[students.length - 1];
                if (currentStudent) {
                  currentStudent.location = latlng;
                }
                setMapOpen(false);
              }}
              initialLatLng={undefined}
            />
          )}
        </div>

        <button className="border font-satoshi border-[#EAB308] text-[#EAB308] font-semibold rounded-full px-8 py-2 text-base bg-transparent shadow-none hover:bg-[#fffbe6] transition-colors duration-200">
          Add Another Student
        </button>
        <button
          type="submit"
          className="w-full bg-[#d4a200] text-white font-semibold rounded-full py-3 text-lg shadow hover:bg-[#c49c00] transition mt-2"
          onClick={handleContinue}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
