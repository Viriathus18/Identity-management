// Sidebar.jsx
import React, { useState } from "react";
import {
  Home,
  Bell,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: <Home />, path: "/dashboard" },
  { label: "Blockchain Test", icon: <Bell />, path: "/transactions" },
  { label: "Wallet", icon: <CreditCard />, path: "/wallets" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ease-in-out bg-[#282828] border-r border-[#3c3836] min-h-screen p-4 flex flex-col shadow-md ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <span
          className={`text-2xl font-bold text-[#ebdbb2] transition-opacity duration-300 ${
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          }`}
        >
          Controls
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#a89984] hover:text-[#ebdbb2]"
        >
          {collapsed ? <Menu /> : <X />}
        </button>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 p-3 text-sm text-[#d5c4a1] rounded-lg hover:bg-[#504945] transition-all"
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
    </div>
  );
};

export default Sidebar;