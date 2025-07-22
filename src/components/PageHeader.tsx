import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const TITLES: Record<string, string> = {
  "/app": "Dashboard",
  "/app/track": "Track Bus",
  "/app/notifications": "Notification",
  "/app/profile": "Profile",
};

interface Student {
  id: number;
  full_name: string;
  profile_picture_url: string | null;
  bus_id: number | null;
}

interface PageHeaderProps {
  students: Student[];
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student) => void;
}

export default function PageHeader({ students, selectedStudent, setSelectedStudent }: PageHeaderProps) {
  const pathname = usePathname();
  const title = TITLES[pathname] || "";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter out the currently selected student from the dropdown list
  const otherStudents = students.filter(
    (student) => student.id !== selectedStudent?.id
  );

  return (
    <header className="w-full bg-[#19191F] px-4 pt-4 pb-0 flex items-center justify-between max-w-md mx-auto">
      <div className="flex items-center gap-2 relative">
        {selectedStudent && (
          <>
            <div className="flex items-center gap-2 relative">
              <Image
                src={
                  selectedStudent.profile_picture_url || "/assets/profile.svg"
                }
                alt={selectedStudent.full_name}
                width={32}
                height={32}
                className="rounded-full bg-white"
              />
              <span className="text-white text-[16px] font-medium font-satoshi">
                {selectedStudent.full_name}
              </span>
              {otherStudents.length > 0 && (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="ml-1"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M7 10l5 5 5-5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            {isDropdownOpen && otherStudents.length > 0 && (
              <div className="absolute top-full left-0 mt-1 bg-[#19191F] rounded-lg shadow-lg z-50 w-full">
                {otherStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[#2a2a32] flex items-center gap-2"
                  >
                    <Image
                      src={student.profile_picture_url || "/assets/profile.svg"}
                      alt={student.full_name}
                      width={32}
                      height={32}
                      className="rounded-full bg-white"
                    />
                    <span className="text-white text-[16px] font-medium font-satoshi">
                      {student.full_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <span className="text-white text-[20px] font-medium font-satoshi">
        {title}
      </span>
    </header>
  );
}