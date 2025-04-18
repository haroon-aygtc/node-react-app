import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../components/home";
import Dashboard from "../pages/admin/dashboard";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminRoute from "../components/auth/AdminRoute";

// Scraping pages
import ScrapingConfiguratorPage from "../pages/admin/scraping/configurator";
import SavedSelectorsPage from "../pages/admin/scraping/selectors";
import ScrapingHistoryPage from "../pages/admin/scraping/history";
import ScrapingProblemsPage from "../pages/admin/scraping/problems";
import ScrapingVisualizationPage from "../pages/admin/scraping/visualization";
import SettingsPage from "../pages/admin/settings";

// User & Role Management page
import UserManagementPage from "../pages/admin/user-management";

// Import other admin components as they become available
// For now, we'll redirect to dashboard for missing components

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/signup" element={<Navigate to="/auth/register" replace />} />

      {/* Legacy Routes - Redirect to new auth paths */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />
      <Route path="/signup" element={<Navigate to="/auth/register" replace />} />

      {/* User Dashboard - Protected for all authenticated users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard - Protected for admin users */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      {/* Widget Config */}
      <Route
        path="/admin/widget-config"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "widget" }} replace />
          </AdminRoute>
        }
      />

      {/* Context Rules Routes */}
      <Route
        path="/admin/context-rules"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "context" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/context-rules/create"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "context", subTab: "rule-editor" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/context-rules/manage"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "context", subTab: "rules-list" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/context-rules/test"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "context", subTab: "test" }} replace />
          </AdminRoute>
        }
      />

      {/* Templates Routes */}
      <Route
        path="/admin/templates"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "templates" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/templates/create"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "templates", subTab: "create" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/templates/manage"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "templates", subTab: "all" }} replace />
          </AdminRoute>
        }
      />

      {/* Scraping Routes */}
      <Route
        path="/admin/scraping"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/configurator"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "configurator" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/selectors"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "selectors" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/history"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "history" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/problems"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "problems" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/visualization"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "visualization" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/advanced"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "advanced" }} replace />
          </AdminRoute>
        }
      />

      {/* Embed Code */}
      <Route
        path="/admin/embed-code"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "embed" }} replace />
          </AdminRoute>
        }
      />

      {/* Analytics */}
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "analytics" }} replace />
          </AdminRoute>
        }
      />

      {/* User & Role Management */}
      <Route
        path="/admin/user-management"
        element={
          <AdminRoute>
            <UserManagementPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/user-management/roles"
        element={
          <AdminRoute>
            <UserManagementPage />
          </AdminRoute>
        }
      />

      {/* Redirects for old user and role management routes */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <Navigate to="/admin/user-management" replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users/*"
        element={
          <AdminRoute>
            <Navigate to="/admin/user-management" replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <AdminRoute>
            <Navigate to="/admin/user-management/roles" replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/roles/*"
        element={
          <AdminRoute>
            <Navigate to="/admin/user-management/roles" replace />
          </AdminRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <SettingsPage />
          </AdminRoute>
        }
      />

      {/* Catch-all admin route */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" replace />
          </AdminRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
