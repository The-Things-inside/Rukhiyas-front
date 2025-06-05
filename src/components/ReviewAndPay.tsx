import React, { useState } from "react";
import StudentEditForm from "./StudentEditForm";
import { generateId } from "@/lib/utils";

export interface StudentCard {
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
  students: initialStudents,
}: {
  students: StudentCard[];
}) {
  const [students, setStudents] = useState<StudentCard[]>(initialStudents);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const handleEdit = (student: StudentCard) => {
    setEditingStudentId(student.id);
  };

  const handleAddStudent = () => {
    const newId = generateId();
    const newStudent: StudentCard = {
      id: newId,
      studentName: "",
      class: "",
      division: "",
      school: "",
      homeAddress: "",
    };
    setStudents((prev) => [...prev, newStudent]);
    setEditingStudentId(newId);
  };

  const handleRemove = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
    if (editingStudentId === id) {
      setEditingStudentId(null);
    }
  };

  return (
    <div className="p-6">
      <h2
        className="text-black text-[20px] text-center mb-6 -mt-3 font-bold"
        style={{ fontFamily: "Spartan, sans-serif", fontWeight: 600 }}
      >
        Review & Estimate
      </h2>
      <div className="rounded-[24px] bg-white border border-gray-200 shadow-md p-6">
        <div
          className="text-black text-[18px] mb-2 -mt-3 font-bold"
          style={{ fontFamily: "Spartan, sans-serif", fontWeight: 600 }}
        >
          Student Details
        </div>
        {students.map((student, idx) => (
          <div
            key={student.id}
            className="mb-4 p-4 rounded-2xl border border-yellow-400 shadow-sm"
          >
            {editingStudentId === student.id ? (
              <StudentEditForm
                initialStudent={student}
                studentNumber={idx + 1}
                onSave={(updatedStudent) => {
                  setStudents((prev) =>
                    prev.map((s) => (s.id === student.id ? updatedStudent : s))
                  );
                  setEditingStudentId(null);
                }}
                onCancel={() => {
                  setEditingStudentId(null);
                }}
                onRemove={() => handleRemove(student.id)}
              />
            ) : (
              <>
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
                  <button
                    className="bg-yellow-400 text-white font-semibold rounded-full py-2 px-8 text-base shadow hover:bg-yellow-500 transition w-1/2"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="border border-yellow-400 text-yellow-400 font-semibold rounded-full py-2 px-8 text-base bg-white hover:bg-yellow-50 transition w-1/2"
                    onClick={() => handleRemove(student.id)}
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        <button
          className="w-full border border-yellow-400 text-yellow-400 font-semibold rounded-full py-3 mt-2 text-lg bg-white hover:bg-yellow-50 transition"
          onClick={handleAddStudent}
        >
          Add Another Student
        </button>
      </div>
      <div className="mt-6 text-center">
        <h2
          className="text-black text-[20px] text-center mb-6 -mt-3 font-bold"
          style={{ fontFamily: "Spartan, sans-serif", fontWeight: 600 }}
        >
          Approximate Price
        </h2>
        <div className="bg-white border border-gray-200 rounded-[24px] p-4                  max-w-md mx-auto shadow-sm">
          <div
            className="text-black text-lg text-left font-bold mb-2"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Estimation
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm font-semibold">Student</span>
            <span className="text-gray-500 text-sm font-semibold">Amount</span>
          </div>
          <ul className="mb-2">
            {students.map((student) => (
              <li
                key={student.id}
                className="flex justify-between items-center py-1"
              >
                <span className="text-black text-base">
                  {student.studentName || "Unnamed Student"}
                </span>
                <span className="text-black text-base font-semibold">
                  ₹2000
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
            <span className="text-black text-base">Total</span>
            <span className="text-black text-base font-bold">
              ₹{students.length * 2000}
            </span>
          </div>
        </div>
        <div className="max-w-md mx-auto mt-4 px-2">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-[16px]">
            <p className="text-xs text-gray-600 italic leading-relaxed">
              This is an{" "}
              <span className="font-semibold text-yellow-700">
                approximate price
              </span>
              . Once we allocate the bus and verify your data, we will send a
              WhatsApp message to the registered number. Then you will be able
              to pay the amount.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
