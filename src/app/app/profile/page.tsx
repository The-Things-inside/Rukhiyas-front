import React from 'react';
import Image from 'next/image';
import BottomNavBar from '@/components/BottomNavBar';

export default function ProfilePage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col items-center pb-20">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-5 py-4 bg-[#19191F]" style={{ maxWidth: 400 }}>
        <div className="flex items-center gap-2">
          <Image src="/assets/DP.svg" alt="Priya" width={36} height={36} className="rounded-full" />
          <span className="text-white text-base font-medium" style={{ fontFamily: 'Satoshi, sans-serif' }}>Hello, Priya</span>
        </div>
        <span className="text-white text-lg font-bold" style={{ fontFamily: 'Satoshi, sans-serif' }}>Profile</span>
      </header>
      {/* Main Content */}
      <div className="flex flex-col items-center w-full" style={{ maxWidth: 400 }}>
        {/* Parent Details */}
        <section className="bg-white rounded-2xl shadow p-5 w-[340px] mb-4 mt-2">
          <h2 className="font-bold text-lg mb-3 text-black">Parent Details</h2>
          <div className="flex items-center mb-2">
            <Image src="/assets/DP.svg" alt="Parent" width={40} height={40} className="rounded-full mr-3" />
            <span className="font-semibold text-base text-black">Priya Sharma</span>
          </div>
          <div className="text-sm mb-1 text-black"><span className="font-medium text-gray-500">Primary Number</span><br/>9988667755</div>
          <div className="text-sm mb-1 text-black"><span className="font-medium text-gray-500">Alternate Number</span><br/>9768568754</div>
          <div className="text-sm mb-1 text-black"><span className="font-medium text-gray-500">Email</span><br/>priyasharma@gmail.com</div>
          <div className="text-sm mb-4 text-black"><span className="font-medium text-gray-500">Primary Address</span><br/>32, AB Villa, 1st Cross, Mico Layout, Madiwala, Bangalore.</div>
          <button className="w-full bg-[#e8b600] text-white font-semibold rounded-full py-2 text-base">Edit</button>
        </section>

        {/* Student Details */}
        <section className="bg-white rounded-2xl shadow p-5 w-[340px] mb-4">
          <h2 className="font-bold text-lg mb-3 text-black">Student Details</h2>
          {/* Student 1 */}
          <div className="border rounded-xl p-3 mb-3 border-[#e8b600]">
            <div className="flex items-center mb-2">
              <Image src="/assets/DP.svg" alt="Aryan Sharma" width={32} height={32} className="rounded-full mr-2" />
              <span className="font-semibold text-black">Aryan Sharma</span>
            </div>
            <div className="text-xs mb-1 text-black"><span className="font-medium text-gray-500">Class</span> 2 B &nbsp; <span className="font-medium text-gray-500">School</span> Avila Primary School</div>
            <div className="text-xs mb-1 text-black"><span className="font-medium text-gray-500">Address</span> 32, AB Villa, 1st Cross, Mico Layout, Madiwala, Bangalore.</div>
            <div className="text-xs mb-1 text-black"><span className="font-medium text-gray-500">Emergency Contact</span> 9988667755 &nbsp; <span className="font-medium text-gray-500">ID No.</span> 456</div>
            <button className="w-full bg-[#e8b600] text-white font-semibold rounded-full py-1 mt-2">Edit</button>
          </div>
          {/* Student 2 */}
          <div className="border rounded-xl p-3 mb-3 border-[#e8b600]">
            <div className="flex items-center mb-2">
              <Image src="/assets/DP.svg" alt="Anora Sharma" width={32} height={32} className="rounded-full mr-2" />
              <span className="font-semibold text-black">Anora Sharma</span>
            </div>
            <div className="text-xs mb-1 text-black"><span className="font-medium text-gray-500">Class</span> 6 A &nbsp; <span className="font-medium text-gray-500">School</span> Alley English Medium High School</div>
            <div className="text-xs mb-1 text-black"><span className="font-medium text-gray-500">Address</span> 32, AB Villa, 1st Cross, Mico Layout, Madiwala, Bangalore.</div>
            <div className="text-xs mb-1 text-black"><span className="font-medium text-gray-500">Emergency Contact</span> 9988667755 &nbsp; <span className="font-medium text-gray-500">ID No.</span> 456</div>
            <button className="w-full bg-[#e8b600] text-white font-semibold rounded-full py-1 mt-2">Edit</button>
          </div>
          <button className="w-full bg-[#e8b600] text-white font-semibold rounded-full py-2">Add Another Student</button>
        </section>

        {/* Billing & Payment */}
        <section className="bg-white rounded-2xl shadow p-5 w-[340px] mb-4">
          <h2 className="font-bold text-lg mb-3 text-black">Billing & Payment</h2>
          <div className="mb-3">
            <div className="text-xs font-semibold mb-1 text-black">Current Subscriptions</div>
            <div className="border rounded-xl p-2 mb-2 flex flex-col gap-1">
              <div className="flex justify-between text-xs text-black"><span>Aryan Sharma</span><span>₹1300/month</span></div>
              <div className="flex justify-between text-xs text-black"><span>Anora Sharma</span><span>₹1200/month</span></div>
            </div>
            <button className="w-full bg-[#e8b600] text-white font-semibold rounded-full py-1 mb-2">Manage Subscriptions</button>
          </div>
          <div className="mb-3">
            <div className="border border-red-400 rounded-xl p-3 mb-2">
              <div className="text-xs text-red-600 font-semibold mb-1">Payment Pending</div>
              <div className="flex justify-between text-xs mb-1 text-black"><span className="font-medium text-gray-500">Due Date</span><span>01/06/2025</span></div>
              <div className="flex justify-between text-xs mb-2 text-black"><span className="font-medium text-gray-500">Amount</span><span>₹2500</span></div>
              <button className="w-full bg-red-600 text-white font-semibold rounded-full py-1">Pay Now</button>
              <div className="text-[10px] text-gray-500 text-center mt-1">Pay now to avoid late fees*</div>
            </div>
          </div>
          <div>
            <div className="border rounded-xl p-3 mb-2">
              <div className="flex justify-between text-xs mb-1 text-black"><span className="font-medium text-gray-500">Due Date</span><span>01/07/2025</span></div>
              <div className="flex justify-between text-xs mb-1 text-black"><span className="font-medium text-gray-500">Amount</span><span>₹2500</span></div>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className="bg-white rounded-2xl shadow p-5 w-[340px] mb-4">
          <h2 className="font-bold text-lg mb-3 text-black">Account Settings</h2>
          <ul className="text-sm divide-y">
            <li className="flex items-center justify-between py-2 cursor-pointer text-black"><span className="flex items-center gap-2"><span className="material-icons">notifications</span>Notification Preferences</span><span>&gt;</span></li>
            <li className="flex items-center justify-between py-2 cursor-pointer text-black"><span className="flex items-center gap-2"><span className="material-icons">lock</span>Change Password</span><span>&gt;</span></li>
            <li className="flex items-center justify-between py-2 cursor-pointer text-black"><span className="flex items-center gap-2"><span className="material-icons">history</span>Service History</span><span>&gt;</span></li>
            <li className="flex items-center justify-between py-2 cursor-pointer text-black"><span className="flex items-center gap-2"><span className="material-icons">receipt_long</span>Payment History</span><span>&gt;</span></li>
            <li className="flex items-center justify-between py-2 cursor-pointer text-black"><span className="flex items-center gap-2"><span className="material-icons">headset_mic</span>Get Help</span><span>&gt;</span></li>
            <li className="flex items-center justify-between py-2 cursor-pointer text-black"><span className="flex items-center gap-2"><span className="material-icons">description</span>Policies & Terms</span><span>&gt;</span></li>
          </ul>
        </section>

        {/* Log Out Button */}
        <button className="w-[340px] bg-[#19191F] text-white font-semibold rounded-full py-3 text-lg mb-4">Log Out</button>
      </div>
      <BottomNavBar />
    </div>
  );
} 