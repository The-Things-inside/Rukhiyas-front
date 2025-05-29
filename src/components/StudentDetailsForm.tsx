"use client";

import { useForm } from "react-hook-form";

interface FormValues {
  studentName: string;
  class: string;
  division: string;
  school: string;
  homeAddress: string;
}

export default function StudentDetailsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

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
      <div className="text-center text-gray-500 text-base mb-2">
        Please provide your child&apos;s details
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Student Full Name
        </label>
        <input
          {...register("studentName", { required: "Student name is required" })}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400"
          placeholder="Enter student's full name"
        />
        {errors.studentName && (
          <span className="text-xs text-red-500">
            {errors.studentName.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Class
        </label>
        <input
          {...register("class", { required: "Class is required" })}
          type="text"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400"
          placeholder="Enter class"
        />
        {errors.class && (
          <span className="text-xs text-red-500">{errors.class.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Division
        </label>
        <input
          {...register("division", { required: "Division is required" })}
          type="text"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400"
          placeholder="Enter division"
        />
        {errors.division && (
          <span className="text-xs text-red-500">
            {errors.division.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          School
        </label>
        <input
          {...register("school", { required: "School is required" })}
          type="text"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400"
          placeholder="Enter school name"
        />
        {errors.school && (
          <span className="text-xs text-red-500">{errors.school.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Home Address
        </label>
        <textarea
          {...register("homeAddress", { required: "Home address is required" })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400"
          placeholder="Enter home address"
          rows={3}
        />
        {errors.homeAddress && (
          <span className="text-xs text-red-500">
            {errors.homeAddress.message}
          </span>
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
