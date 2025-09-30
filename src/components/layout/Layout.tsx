import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}