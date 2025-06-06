import { useForm } from "react-hook-form";
import SchoolDropdown from "./SchoolDropdown";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { StudentCard } from "./ReviewAndPay";
import { generateId } from "@/lib/utils";

const MapAddressPicker = dynamic(() => import("./MapAddressPicker"), {
  ssr: false,
});

interface StudentEditFormProps {
  initialStudent?: Partial<StudentCard>;
  onSave: (student: StudentCard) => void;
  onCancel: () => void;
  onRemove?: () => void;
  studentNumber?: number;
  saving?: boolean;
}

export default function StudentEditForm({
  initialStudent = {},
  onSave,
  onCancel,
  onRemove,
  studentNumber,
  saving = false,
}: StudentEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      studentName: initialStudent.studentName || "",
      class: initialStudent.class || "",
      division: initialStudent.division || "",
      school: initialStudent.school || "",
      homeAddress: initialStudent.homeAddress || "",
    },
  });

  const [mapOpen, setMapOpen] = useState(false);
  const [location, setLocation] = useState(initialStudent.location);
  const schoolValue = watch("school");
  const homeAddress = watch("homeAddress");

  const onSubmit = (data: Omit<StudentCard, "id" | "location">) => {
    onSave({
      id: initialStudent.id || generateId(),
      ...data,
      location,
    });
    reset();
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-yellow-500 font-semibold text-base">
          {studentNumber ? `Student ${studentNumber}` : "Student"}
        </span>
        {onRemove && (
          <button
            type="button"
            className="text-black underline text-sm font-medium"
            onClick={onRemove}
          >
            Remove
          </button>
        )}
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Full Name
        </label>
        <input
          {...register("studentName", { required: "Student name is required" })}
          placeholder="Enter student's full name"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black placeholder:text-gray-500"
        />
        {errors.studentName && (
          <span className="text-xs text-red-500">
            {errors.studentName.message as string}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Class
          </label>
          <input
            {...register("class", { required: "Class is required" })}
            placeholder="Enter class"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black placeholder:text-gray-500"
          />
          {errors.class && (
            <span className="text-xs text-red-500">
              {errors.class.message as string}
            </span>
          )}
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Division
          </label>
          <input
            {...register("division", { required: "Division is required" })}
            placeholder="Enter division"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black placeholder:text-gray-500"
          />
          {errors.division && (
            <span className="text-xs text-red-500">
              {errors.division.message as string}
            </span>
          )}
        </div>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          School
        </label>
        <SchoolDropdown
          value={schoolValue}
          onChange={(value) =>
            setValue("school", value, { shouldValidate: true })
          }
          error={errors.school?.message as string}
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Home Address
        </label>
        <button
          type="button"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black text-left flex items-center gap-2 bg-white"
          onClick={() => setMapOpen(true)}
        >
          <svg
            className="w-5 h-5 mr-2 text-yellow-400"
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
            {errors.homeAddress.message as string}
          </span>
        )}
        {mapOpen && (
          <MapAddressPicker
            open={mapOpen}
            onClose={() => setMapOpen(false)}
            onConfirm={(address, latlng) => {
              setValue("homeAddress", address, { shouldValidate: true });
              setLocation(latlng);
              setMapOpen(false);
            }}
            initialLatLng={location}
          />
        )}
      </div>
      <div className="flex w-full gap-4 mt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-yellow-400 text-white font-semibold rounded-full py-2 px-8 text-base shadow hover:bg-yellow-500 transition w-1/2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Save"
          )}
        </button>
        <button
          type="button"
          disabled={saving}
          className="border border-yellow-400 text-yellow-400 font-semibold rounded-full py-2 px-8 text-base bg-white hover:bg-yellow-50 transition w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
