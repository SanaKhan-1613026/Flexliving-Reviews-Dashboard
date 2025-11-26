"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSettings } from "./context/SettingsContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { theme, fontSize } = useSettings();

  // Apply dark/light theme
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light"
    );
  }, [theme]);

  // Apply dynamic font size
  useEffect(() => {
    const size =
      fontSize === "small"
        ? "14px"
        : fontSize === "large"
        ? "18px"
        : "16px"; // default

    document.documentElement.style.setProperty("--font-size", size);
    console.log("APPLYING FONT SIZE:", size);
  }, [fontSize]);

  return (
    <div className="layout-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-title">FlexLiving</h1>

        <nav className="sidebar-nav">
          <Link href="/" className="sidebar-link">
            Dashboard
          </Link>
          <Link href="/properties" className="sidebar-link">
            Properties
          </Link>
          <Link href="/analytics" className="sidebar-link">
            Analytics
          </Link>
          <Link href="/settings" className="sidebar-link">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main">{children}</main>
    </div>
  );
}
