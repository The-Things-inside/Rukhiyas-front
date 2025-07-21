"use client";
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import StudentsList from "../dashboard/StudentsList";

export default function StudentsListPage() {
  return (
    <AdminLayout
      pageTitle="Students List"
      activeTab="students"
      onTabChange={() => {}}
    >
      <StudentsList />
    </AdminLayout>
  );
} 