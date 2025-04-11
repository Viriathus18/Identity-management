// Sidebar.jsx
import React, { useState } from "react";
import {
  Home,
  Mail,
  Bell,
  Calendar,
  BarChart2,
  CreditCard,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: <Home />, path: "/dashboard" },
  { label: "Inbox", icon: <Mail />, path: "/inbox" },
  { label: "Notifications", icon: <Bell />, path: "/notifications" },
  { label: "Schedule", icon: <Calendar />, path: "/schedule" },
  { label: "Statistics", icon: <BarChart2 />, path: "/statistics" },
  { label: "Wallet", icon: <CreditCard />, path: "/wallets" },
  { label: "Settings", icon: <Settings />, path: "/settings" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ease-in-out bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col shadow-sm ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <span
          className={`text-2xl font-bold text-gray-900 transition-opacity duration-300 ${
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          }`}
        >
          Controls
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-900"
        >
          {collapsed ? <Menu /> : <X />}
        </button>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span
              className={`transition-all duration-300 ${
                collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {!collapsed && (
        <div className="mt-auto">
          <h4 className="text-xs text-gray-500 mb-2 px-2">Projects</h4>
          <div className="px-2 space-y-2">
            <div>
              <p className="text-sm">Update Text Styles</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full w-1/4"></div>
              </div>
            </div>
            <div>
              <p className="text-sm">Add Components</p>
              <div className="w-full bg-yellow-200 rounded-full h-1.5">
                <div className="bg-yellow-500 h-1.5 rounded-full w-3/4"></div>
              </div>
            </div>
            <div>
              <p className="text-sm">Checkboxes Checked</p>
              <div className="w-full bg-green-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
