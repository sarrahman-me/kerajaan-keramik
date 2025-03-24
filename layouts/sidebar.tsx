
"use client";

import { ReactElement } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";
import { isActivePage } from "@/utils/isActivePage";
import { usePathname, useRouter } from "next/navigation";

interface menuInterface {
  title: string;
  icon: ReactElement;
  href: string;
}

const dashboard_menu_dekstop: menuInterface[] = [
  {
    title: "Dashboard",
    icon: <MdOutlineDashboard />,
    href: "/dashboard",
  },
  {
    title: "Kelola Pengguna",
    icon: <HiOutlineUsers />,
    href: "/dashboard/pengguna",
  },
];


const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="space-y-10 select-none">
      {/* logo */}
      <span className="flex items-center justify-center space-x-2 text-lg md:text-xl text-blue-600">
        <p className="hidden lg:inline font-semibold">Kerajaan Keramik</p>
      </span>

      {/* navigation */}
      <div className="space-y-3">
        {dashboard_menu_dekstop.map((item, i) => {
          const isActive = isActivePage(item.href, pathname);
          return (
            <div
              key={i}
              onClick={() => router.push(item.href)}
              className={`flex items-center space-x-3 p-2 rounded-sm text-secondary-medium cursor-pointer select-none ${isActive
                ? "bg-blue-600 text-white font-medium shadow-sm"
                : "hover:bg-blue-50"
                }`}
            >
              <span
                className={`text-lg ${isActive ? "text-white" : "text-blue-600"
                  }`}
              >
                {item.icon}
              </span>
              <p className="lg:block hidden">{item.title}</p>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
