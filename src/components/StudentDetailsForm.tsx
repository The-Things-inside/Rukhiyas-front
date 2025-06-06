"use client";

import { useForm } from "react-hook-form";
import SchoolDropdown from "./SchoolDropdown";
import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

interface FormValues {
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

interface StudentCard {
  id: string;
  studentName: string;
  class: string;
  division: string;
  school: string;
  schoolName?: string;
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
  parentId: number;
}

export default function StudentDetailsForm({ onContinue, parentId }: StudentDetailsFormProps) {
  const [students, setStudents] = useState<StudentCard[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  // Form for the current student being entered
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>();

  const schoolValue = watch("school");
  const homeAddress = watch("homeAddress");

  // Add current form as a student and clear form
  const handleAddStudent = (data: FormValues) => {
    const schools = [
      { id: "1", name: "St. Mary's High School" },
      { id: "2", name: "Delhi Public School" },
      { id: "3", name: "Kendriya Vidyalaya" },
      { id: "4", name: "Modern Public School" },
      { id: "5", name: "Springdales School" },
    ];
    const selectedSchool = schools.find((school) => school.id === data.school);
    const newStudent: StudentCard = {
      id: Date.now().toString(),
      ...data,
      schoolName: selectedSchool?.name,
    };
    setStudents((prev) => [...prev, newStudent]);
    reset();
  };

  // Remove a student
  const handleRemoveStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Submit all students
  const onSubmit = async (data: FormValues) => {
    // Build the list to submit: all students in array + last form if filled
    const allStudents = [...students];
    if (
      data.studentName &&
      data.class &&
      data.division &&
      data.school &&
      data.homeAddress
    ) {
      const schools = [
        { id: "1", name: "St. Mary's High School" },
        { id: "2", name: "Delhi Public School" },
        { id: "3", name: "Kendriya Vidyalaya" },
        { id: "4", name: "Modern Public School" },
        { id: "5", name: "Springdales School" },
      ];
      const selectedSchool = schools.find(
        (school) => school.id === data.school
      );
      const newStudent: StudentCard = {
        id: Date.now().toString(),
        ...data,
        schoolName: selectedSchool?.name,
      };
      allStudents.push(newStudent);
    }
    if (allStudents.length === 0) {
      alert("Please add at least one student before continuing");
      return;
    }
    setIsSubmitting(true);
    try {
      for (const student of allStudents) {
        const studentData = {
          parent_id: parentId,
          school_id: parseInt(student.school),
          full_name: student.studentName,
          class_name: student.class,
          division: student.division,
          student_address: student.homeAddress,
          location_latitude: student.location?.lat || 0,
          location_longitude: student.location?.lng || 0,
        };
        console.log("Registering student:", studentData);
        await axios.post(
          "https://13.235.104.94/register-student",
          studentData,
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );
      }
      onContinue(allStudents);
    } catch {
      alert("Error registering students. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gold box style
  const goldBox =
    "border border-[#EAB308] rounded-xl p-4 mb-4 bg-white shadow-sm relative";
  const goldLabel = "text-[#EAB308] font-bold text-base";
  const removeBtn =
    "absolute right-4 top-4 text-sm text-gray-500 hover:text-red-500 cursor-pointer";

  return (
    <div className="px-6 pt-2">
      {/* Render already added students as gold boxes */}
      {students.map((student, idx) => (
        <div className={goldBox + " w-full"} key={student.id}>
          <div className="flex justify-between items-center mb-2">
            <span className={goldLabel}>{`Student ${idx + 1}`}</span>
            <span
              className={removeBtn}
              onClick={() => handleRemoveStudent(student.id)}
            >
              Remove
            </span>
          </div>
          <div className="mb-2">
            <input
              value={student.studentName}
              disabled
              className="w-full max-w-full border border-gray-300 rounded-xl px-4 py-2 text-base bg-[#faf9f6] text-black mb-2"
            />
            <div className="flex gap-4 mb-2">
              <input
                value={student.class}
                disabled
                className="w-1/2 border border-gray-300 rounded-xl px-4 py-2 text-base bg-[#faf9f6] text-black"
              />
              <input
                value={student.division}
                disabled
                className="w-1/2 border border-gray-300 rounded-xl px-4 py-2 text-base bg-[#faf9f6] text-black"
              />
            </div>
            <input
              value={student.schoolName || ""}
              disabled
              className="w-full max-w-full border border-gray-300 rounded-xl px-4 py-2 text-base bg-[#faf9f6] text-black mb-2"
            />
            <input
              value={student.homeAddress}
              disabled
              className="w-full max-w-full border border-gray-300 rounded-xl px-4 py-2 text-base bg-[#faf9f6] text-black"
            />
          </div>
        </div>
      ))}
      {/* Only show the form if not submitting */}
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
                setValue("location", latlng, { shouldValidate: true });
                setMapOpen(false);
              }}
              initialLatLng={undefined}
            />
          )}
        </div>
        <button
          type="button"
          className="border font-satoshi border-[#EAB308] text-[#EAB308] font-semibold rounded-full px-8 py-2 text-base bg-transparent shadow-none hover:bg-[#fffbe6] transition-colors duration-200"
          onClick={handleSubmit(handleAddStudent)}
        >
          Add Another Student
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#d4a200] text-white font-semibold rounded-full py-3 text-lg shadow hover:bg-[#c49c00] transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Registering..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
