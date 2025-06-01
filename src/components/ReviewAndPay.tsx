import React, { useState } from "react";

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
  const [editForm, setEditForm] = useState<Partial<StudentCard>>({});

  const handleEdit = (student: StudentCard) => {
    setEditingStudentId(student.id);
    setEditForm({ ...student });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingStudentId(null);
    setEditForm({});
  };

  const handleSave = () => {
    if (!editingStudentId) return;
    setStudents((prev) =>
      prev.map((student) =>
        student.id === editingStudentId
          ? ({ ...student, ...editForm } as StudentCard)
          : student
      )
    );
    setEditingStudentId(null);
    setEditForm({});
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
    setEditForm({ ...newStudent });
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
              <form className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-500 font-semibold text-base">
                    Student {idx + 1}
                  </span>
                  <button
                    type="button"
                    className="text-black underline text-sm font-medium"
                    onClick={handleCancel}
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={editForm.studentName || ""}
                    onChange={handleFormChange}
                    placeholder="Enter student's full name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black placeholder:text-gray-500"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Class
                    </label>
                    <input
                      type="text"
                      name="class"
                      value={editForm.class || ""}
                      onChange={handleFormChange}
                      placeholder="Enter class"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black placeholder:text-gray-500"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Division
                    </label>
                    <input
                      type="text"
                      name="division"
                      value={editForm.division || ""}
                      onChange={handleFormChange}
                      placeholder="Enter division"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    School
                  </label>
                  <select
                    name="school"
                    value={editForm.school || ""}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black placeholder:text-gray-500"
                  >
                    <option value="">Select School</option>
                    <option value="School A">School A</option>
                    <option value="School B">School B</option>
                    <option value="School C">School C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Student Address
                  </label>
                  <input
                    type="text"
                    name="homeAddress"
                    value={editForm.homeAddress || ""}
                    onChange={handleFormChange}
                    placeholder="Enter student address"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black placeholder:text-gray-500"
                  />
                </div>
                <div className="flex w-full gap-4 mt-2">
                  <button
                    type="button"
                    className="bg-yellow-400 text-white font-semibold rounded-full py-2 px-8 text-base shadow hover:bg-yellow-500 transition w-1/2"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="border border-yellow-400 text-yellow-400 font-semibold rounded-full py-2 px-8 text-base bg-white hover:bg-yellow-50 transition w-1/2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
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
                  <button className="border border-yellow-400 text-yellow-400 font-semibold rounded-full py-2 px-8 text-base bg-white hover:bg-yellow-50 transition w-1/2">
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
