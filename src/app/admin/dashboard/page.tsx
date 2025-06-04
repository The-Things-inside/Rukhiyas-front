"use client";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-[#1E1E24] rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Welcome to Admin Dashboard
        </h2>
        <p className="text-gray-400">
          Manage your school transport system efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overview Cards */}
        <div className="bg-[#1E1E24] rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">
            Total Students
          </h3>
          <p className="text-3xl font-bold text-[#f2c200]">0</p>
        </div>

        <div className="bg-[#1E1E24] rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">Active Buses</h3>
          <p className="text-3xl font-bold text-[#f2c200]">0</p>
        </div>

        <div className="bg-[#1E1E24] rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">Routes</h3>
          <p className="text-3xl font-bold text-[#f2c200]">0</p>
        </div>

        <div className="bg-[#1E1E24] rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">Drivers</h3>
          <p className="text-3xl font-bold text-[#f2c200]">0</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-[#1E1E24] rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="text-gray-400">No recent activities to display</div>
      </div>
    </div>
  );
}
