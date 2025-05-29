"use client";

import { useForm } from "react-hook-form";
import SchoolDropdown from "./SchoolDropdown";
import { useState } from "react";
import dynamic from "next/dynamic";

interface FormValues {
  studentName: string;
  class: string;
  division: string;
  school: string;
  homeAddress: string;
}

const MapAddressPicker = dynamic(() => import("./MapAddressPicker"), {
  ssr: false,
});

export default function StudentDetailsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>();

  const schoolValue = watch("school");
  const [mapOpen, setMapOpen] = useState(false);
  const homeAddress = watch("homeAddress");

  const onSubmit = (data: FormValues) => {
    // Handle student details submission
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 pt-2 flex flex-col gap-3"
    >
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
          {...register("studentName", { required: "Student name is required" })}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-gray-900"
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-gray-900"
            placeholder="Enter class"
          />
          {errors.class && (
            <span className="text-xs text-red-500">{errors.class.message}</span>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Division
          </label>
          <input
            {...register("division", { required: "Division is required" })}
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-gray-900"
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
            onConfirm={(address) => {
              setValue("homeAddress", address, { shouldValidate: true });
              setMapOpen(false);
            }}
            initialLatLng={undefined}
          />
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[#d4a200] text-white font-semibold rounded-full py-3 text-lg shadow hover:bg-[#c49c00] transition mt-2"
      >
        Continue
      </button>
    </form>
  );
}
