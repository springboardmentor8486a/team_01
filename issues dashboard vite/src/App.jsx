import React from "react";
import { ThemeProvider } from "./components/theme-provider"; // named import
import IssueDashboard from "./components/issue-dashboard";    // file exists at src/components/issue-dashboard.tsx
import { useIsMobile } from "./hooks/use-mobile";              // named import
import { useToast } from "./hooks/use-toast";                // named import

function AppContent() {
  const isMobile = useIsMobile();
  const toast = useToast();

  // optional: show device type or test toast
  return (
    <div style={{ padding: "2rem" }}>
      
      

      <IssueDashboard />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
