/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession, redirectToLogin } from "@/lib/auth-token";

const menuItems = [
  {
    key: "home",
    label: "Home",
    icon: <img src="/assets/home.svg" alt="Home" className="h-5 w-5" />,
    selectedIcon: (
      <img src="/assets/homeselected.svg" alt="Home" className="h-5 w-5" />
    ),
    route: "/admin/dashboard",
  },
  {
    key: "students",
    label: "Students",
    icon: <img src="/assets/students.svg" alt="Students" className="h-5 w-5" />,
    selectedIcon: (
      <img
        src="/assets/studentsselected.svg"
        alt="Students"
        className="h-5 w-5"
      />
    ),
    route: "/admin/studentslist",
  },
  {
    key: "fleet",
    label: "Fleet",
    icon: <img src="/assets/fleet.svg" alt="Fleet" className="h-5 w-5" />,
    selectedIcon: (
      <img src="/assets/fleetselected.svg" alt="Fleet" className="h-5 w-5" />
    ),
    route: "/admin/fleets",
  },
  {
    key: "track-bus",
    label: "Track Bus",
    icon: (
      <img src="/assets/trackbus.svg" alt="Track Bus" className="h-5 w-5" />
    ),
    selectedIcon: (
      <img
        src="/assets/trackbusselected.svg"
        alt="Track Bus"
        className="h-5 w-5"
      />
    ),
    route: "/admin/dashboard",
  },
  {
    key: "settings",
    label: "Settings & Logs",
    icon: <img src="/assets/settings.svg" alt="Settings" className="h-5 w-5" />,
    selectedIcon: (
      <img
        src="/assets/settingselected.svg"
        alt="Settings"
        className="h-5 w-5"
      />
    ),
    route: "/admin/dashboard",
  },
];

export default function AdminDrawer({
  open,
  onClose,
  activeTab,
  onTabChange,
}: {
  open: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    const menuItem = menuItems.find(item => item.key === tab);
    if (menuItem) {
      if (tab === "students" || tab === "fleet" || tab === "home") {
        router.push(menuItem.route);
      } else {
        onTabChange(tab);
      }
    }
    onClose();
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      clearAuthSession();
      redirectToLogin();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-xs bg-[#19191F] z-50 transition-transform duration-300 shadow-2xl ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-6">
          {/* Logo */}
          <div>
            <img src="/assets/logo.svg" alt="RUKHIYAS" />
          </div>
          <div className="flex items-center gap-4">
            {/* Bell Icon */}
            <button>
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.0176 7.25279C17.0155 6.30885 18.5475 6.32092 19.6553 7.04674C19.7222 7.09787 19.787 7.15179 19.8506 7.20689C19.5074 7.71587 19.2575 8.29229 19.1201 8.91099C18.9718 8.6886 18.7855 8.4964 18.5391 8.34849C17.9466 8.08132 17.3683 8.2434 16.9326 8.71568C16.727 8.98807 16.5985 9.30327 16.4619 9.61412C16.1704 10.2465 15.7732 10.4863 15.1592 10.7655C13.9978 11.2958 13.1061 12.2173 12.6562 13.4169C12.3247 14.3629 12.2726 15.3173 12.25 16.3104C12.1906 18.9173 11.8073 21.0341 10.1094 23.0663C10.0722 23.111 10.0353 23.1559 9.99707 23.202C9.96427 23.2405 9.93124 23.2795 9.89746 23.3192C9.80908 23.4332 9.80852 23.4337 9.82715 23.6307C9.95715 23.6957 10.0478 23.6892 10.1934 23.6893H10.75C10.9328 23.6896 11.116 23.6904 11.2988 23.6903C11.4958 23.6903 11.6927 23.69 11.8896 23.6903C12.2757 23.6907 12.6618 23.6912 13.0479 23.6913C13.3613 23.6913 13.6748 23.6911 13.9883 23.6913C14.8765 23.6917 15.7651 23.6923 16.6533 23.6922H16.9443C17.7223 23.6922 18.5003 23.6925 19.2783 23.6932C20.0764 23.694 20.8747 23.6942 21.6729 23.6942C22.1213 23.6942 22.5701 23.6946 23.0186 23.6952H25.3809C25.4739 23.6956 25.4743 23.6957 25.5693 23.6961C25.6254 23.6959 25.6815 23.6954 25.7393 23.6952C25.8122 23.6952 25.8122 23.6952 25.8867 23.6952C26.0126 23.6935 26.0125 23.6933 26.1045 23.5799C26.0869 23.4123 26.0187 23.3172 25.9102 23.1922C25.8658 23.1403 25.8655 23.1398 25.8203 23.0868C25.7886 23.05 25.7563 23.0134 25.7236 22.9754C24.1061 21.0508 23.7296 18.8766 23.6846 16.4208C23.6755 15.9313 23.651 15.45 23.5947 14.9813C23.7285 14.992 23.8635 14.9999 24 14.9999C24.4437 14.9999 24.8736 14.9404 25.2832 14.8319C25.3251 15.222 25.3485 15.6168 25.3564 16.0184C25.4005 18.1503 25.5451 20.0582 26.9463 21.7596C27.5371 22.4774 27.8807 22.9288 27.7939 23.8876C27.6992 24.3815 27.4119 24.7366 27.0234 25.0458C26.48 25.4097 25.9223 25.3923 25.2949 25.3866C25.2016 25.3863 25.108 25.3858 25.0146 25.3856C24.7702 25.385 24.5257 25.3834 24.2812 25.3817C24.0311 25.3801 23.7804 25.3795 23.5303 25.3788C23.0405 25.3771 22.5503 25.3752 22.0605 25.3719C22.0612 25.4288 22.0618 25.4289 22.0625 25.4872C22.0628 25.5374 22.0631 25.5877 22.0635 25.6395C22.0641 25.714 22.0638 25.7142 22.0645 25.7899C22.0394 26.7764 21.4867 27.6954 20.8057 28.371C19.9397 29.189 18.8811 29.4928 17.7158 29.4774C16.6093 29.4443 15.6287 28.9264 14.873 28.1356C14.2846 27.4468 13.8628 26.5808 13.8691 25.6629C13.8694 25.6083 13.8698 25.5533 13.8701 25.4969C13.8707 25.4352 13.8705 25.4349 13.8711 25.3719C13.8192 25.3725 13.7673 25.3723 13.7139 25.3729C13.223 25.3781 12.7321 25.3821 12.2412 25.3846C11.989 25.386 11.7366 25.3876 11.4844 25.3905C11.2404 25.3933 10.9959 25.3947 10.752 25.3954C10.6595 25.3958 10.5671 25.3969 10.4746 25.3983C9.78915 25.4082 9.20904 25.3534 8.68848 24.8534C8.29525 24.4294 8.08785 24.0129 8.08691 23.4266C8.13836 22.8261 8.42718 22.4073 8.81348 21.9686C10.3076 20.2694 10.5175 18.3583 10.5635 16.1629C10.6099 13.9816 11.0715 11.9185 12.6943 10.3553C13.2069 9.90044 13.7615 9.56137 14.3721 9.25279C14.4091 9.23408 14.4463 9.21543 14.4844 9.19615C14.5754 9.15181 14.6684 9.11145 14.7617 9.07213C14.9305 8.97037 14.959 8.8912 15.0225 8.70689C15.2271 8.16866 15.5158 7.76342 15.9189 7.35338C15.9515 7.32018 15.9841 7.287 16.0176 7.25279ZM15.5605 25.3719C15.5606 26.0996 15.7801 26.6057 16.2822 27.12C16.7974 27.6086 17.3605 27.7981 18.0615 27.7967C18.6746 27.7796 19.2454 27.5159 19.6934 27.0995C20.1471 26.6116 20.372 26.0326 20.3721 25.3719H15.5605Z"
                  fill="white"
                />
                <circle cx="24" cy="10" r="4" fill="#E8B600" />
              </svg>
            </button>
            {/* Close Icon */}
            <button onClick={onClose} aria-label="Close menu">
              <img
                src="/assets/menuclose.svg"
                alt="Close"
                className="h-6 w-6"
              />
            </button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="px-6 mt-6">
          <div className="flex items-center bg-white rounded-full px-4 py-2">
            <input
              className="flex-1 bg-transparent outline-none text-black font-satoshi text-base placeholder:text-[#9b9b9b]"
              placeholder="Search anything"
            />
            <button className="ml-2 bg-[#19191F] rounded-full p-2">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>
        {/* Menu Items */}
        <nav className="mt-8 flex flex-col gap-2 px-6">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`flex items-center gap-3 text-[#ebebeb] rounded-xl px-4 py-3 transition font-satoshi text-base ${
                activeTab === item.key
                  ? "font-bold text-white bg-[#e8b6004f] bg-opacity-80 border-opacity-20"
                  : "font-medium hover:bg-white/10"
              }`}
              onClick={() => handleTabChange(item.key)}
            >
              {activeTab === item.key ? item.selectedIcon : item.icon}
              {item.label}
            </button>
          ))}
          {/* Logout */}
          <button onClick={handleLogout} className="flex items-center gap-3 text-[#ebebeb] rounded-xl px-4 py-3 transition font-satoshi text-base font-medium hover:bg-white/10">
            <img src="/assets/logout.svg" alt="Logout" className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
