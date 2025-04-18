import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import AppRoutes from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ui/error-boundary";
import AuthInitializer from "@/components/auth/AuthInitializer";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <ErrorBoundary>
          <AuthInitializer>
            <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
              <div className="app-container">
                <Routes>
                  {/* Your existing routes */}
                  <Route path="/*" element={<AppRoutes />} />
                </Routes>
              </div>
            </Suspense>
          </AuthInitializer>
          <Toaster />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
