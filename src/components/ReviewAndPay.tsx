import React, { useState } from "react";
import StudentEditForm from "./StudentEditForm";

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
    const newId = Math.random().toString(36).substr(2, 9);
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
      <div className="mt-6 text-center"></div>
    </div>
  );
}
