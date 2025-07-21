import React, { useState, useEffect } from "react";
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

interface ApiStudent {
  id: number;
  parent_id: number;
  school_id: number;
  bus_id: number | null;
  full_name: string;
  class_name: string;
  division: string;
  student_address: string;
  location_latitude: number;
  location_longitude: number;
  approximate_fees: number;
  actual_fees: number | null;
  is_submitted: boolean;
  is_paid: boolean;
  created_at: string;
}

interface ReviewAndPayProps {
  students: StudentCard[];
  onStudentsChange?: (students: StudentCard[]) => void;
}

export default function ReviewAndPay({
  students,
  onStudentsChange,
}: ReviewAndPayProps) {
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [students]);

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
    onStudentsChange?.([...students, newStudent]);
    setEditingStudentId(newId);
  };

  const handleRemove = (id: string) => {
    onStudentsChange?.(students.filter((student) => student.id !== id));
    if (editingStudentId === id) {
      setEditingStudentId(null);
    }
  };

  const handleSave = async (updatedStudent: StudentCard) => {
    if (
      !updatedStudent.studentName &&
      !updatedStudent.class &&
      !updatedStudent.division &&
      !updatedStudent.school &&
      !updatedStudent.homeAddress
    ) {
      handleRemove(updatedStudent.id);
      return;
    }

    setSaving(true);
    try {
      const parentId = localStorage.getItem("parent_id");
      const accessToken = localStorage.getItem("access_token");

      if (!parentId || !accessToken) {
        throw new Error("Parent ID or access token not found");
      }

      const isNewStudent = !updatedStudent.id.match(/^\d+$/);

      let response;
      if (isNewStudent) {
        response = await fetch("https://api.rukhiyastravels.com/register-student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            parent_id: parseInt(parentId),
            school_id: parseInt(updatedStudent.school),
            full_name: updatedStudent.studentName,
            class_name: updatedStudent.class,
            division: updatedStudent.division,
            student_address: updatedStudent.homeAddress,
            location_latitude: updatedStudent.location?.lat || 0,
            location_longitude: updatedStudent.location?.lng || 0,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to register student");
        }

        // After successful registration, fetch all students
        const studentsResponse = await fetch(
          `https://api.rukhiyastravels.com/students?parent_id=${parentId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!studentsResponse.ok) {
          throw new Error("Failed to fetch updated students");
        }

        const apiStudents: ApiStudent[] = await studentsResponse.json();
        const mappedStudents: StudentCard[] = apiStudents.map((student) => ({
          id: student.id.toString(),
          studentName: student.full_name,
          class: student.class_name,
          division: student.division,
          school: student.school_id.toString(),
          homeAddress: student.student_address,
          location: {
            lat: student.location_latitude,
            lng: student.location_longitude,
          },
        }));

        onStudentsChange?.(mappedStudents);
      } else {
        response = await fetch(
          `https://api.rukhiyastravels.com/students/${updatedStudent.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              parent_id: parseInt(parentId),
              school_id: parseInt(updatedStudent.school),
              full_name: updatedStudent.studentName,
              class_name: updatedStudent.class,
              division: updatedStudent.division,
              student_address: updatedStudent.homeAddress,
              location_latitude: updatedStudent.location?.lat || 0,
              location_longitude: updatedStudent.location?.lng || 0,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update student");
        }

        const updatedApiStudent: ApiStudent = await response.json();
        const mappedStudent: StudentCard = {
          id: updatedApiStudent.id.toString(),
          studentName: updatedApiStudent.full_name,
          class: updatedApiStudent.class_name,
          division: updatedApiStudent.division,
          school: updatedApiStudent.school_id.toString(),
          homeAddress: updatedApiStudent.student_address,
          location: {
            lat: updatedApiStudent.location_latitude,
            lng: updatedApiStudent.location_longitude,
          },
        };

        onStudentsChange?.(
          students.map((s) => (s.id === updatedStudent.id ? mappedStudent : s))
        );
      }

      setEditingStudentId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

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
                onSave={handleSave}
                onCancel={() => {
                  if (
                    !student.studentName &&
                    !student.class &&
                    !student.division &&
                    !student.school &&
                    !student.homeAddress
                  ) {
                    handleRemove(student.id);
                  } else {
                    setEditingStudentId(null);
                  }
                }}
                onRemove={() => handleRemove(student.id)}
                saving={saving}
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
        <div className="bg-white border border-gray-200 rounded-[24px] p-4 max-w-md mx-auto shadow-sm">
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
