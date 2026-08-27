import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { FontSizeProvider } from "./context/FontSizeContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/Layout";
import PSLoader from "./components/PSLoader";

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <ThemeProvider>
      <FontSizeProvider>
        <BrowserRouter>
          <AuthProvider>
            {/* PSLoader covers the screen — removed from DOM once wipe completes */}
            {!loaderDone && (
              <PSLoader onComplete={() => setLoaderDone(true)} />
            )}
            <Layout>
              <AppRoutes />
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </FontSizeProvider>
    </ThemeProvider>
  );
}
