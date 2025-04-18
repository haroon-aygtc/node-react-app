import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserManagementPanel from "@/components/admin/UserManagement";
import DashboardHeader from "@/components/admin/DashboardHeader";
import Sidebar from "@/components/admin/Sidebar";

const UserManagementPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const location = useLocation();

  // Determine which tab to show based on the URL
  const getDefaultTab = () => {
    const path = location.pathname;
    console.log('Current path:', path);
    if (path.includes('/admin/user-management/roles')) {
      return 'roles';
    }
    return 'users';
  };

  // Log component mount
  useEffect(() => {
    console.log('UserManagementPage mounted');
    console.log('Default tab:', getDefaultTab());
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden dashboard-content">
        <DashboardHeader
          title="User & Role Management"
        />

        <main className="flex-1 overflow-y-auto">
          {/* Key prop forces re-render when path changes */}
          <UserManagementPanel
            key={location.pathname}
            defaultTab={getDefaultTab()}
          />
        </main>
      </div>
    </div>
  );
};

export default UserManagementPage;
