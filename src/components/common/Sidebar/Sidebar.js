"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Wind, Map, BarChart2, Star, Settings } from "lucide-react";
import "./Sidebar.css";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Forecast", icon: Calendar, href: "/forecast" },
  { name: "Air Quality", icon: Wind, href: "/air-quality" },
  { name: "Weather Maps", icon: Map, href: "/maps" },
  { name: "Compare Cities", icon: BarChart2, href: "/compare" },
  { name: "Favorites", icon: Star, href: "/favorites" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href
          ? pathname === item.href
          : item.active;
        const className = `sidebar-item${isActive ? " active" : ""}`;

        if (item.href) {
          return (
            <Link
              key={item.name}
              href={item.href}
              className={className}
              aria-label={item.name}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        }

        return (
          <div key={item.name} className={className}>
            <Icon size={20} />
            <span>{item.name}</span>
          </div>
        );
      })}
    </aside>
  );
}