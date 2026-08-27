import { createContext, useContext, useState, useEffect, useCallback } from "react";

const FontSizeContext = createContext(undefined);

const STORAGE_KEY = "ps-font-size";
const SIZES = ["small", "medium", "large"];

function getInitialFontSize() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (SIZES.includes(stored)) return stored;
  }
  return "medium";
}

export function FontSizeProvider({ children }) {
  const [fontSize, setFontSize] = useState(getInitialFontSize);

  // Apply data-font-size attribute on <html> whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    localStorage.setItem(STORAGE_KEY, fontSize);
  }, [fontSize]);

  const cycleFontSize = useCallback(() => {
    setFontSize((prev) => {
      const idx = SIZES.indexOf(prev);
      return SIZES[(idx + 1) % SIZES.length];
    });
  }, []);

  return (
    <FontSizeContext.Provider value={{ fontSize, cycleFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (ctx === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return ctx;
}
