import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  toggle: () => {},
});

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // initial value from localStorage or system preference
    const savedMode = localStorage.getItem("darkMode");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = savedMode !== null ? savedMode === "true" : prefersDark;

    setIsDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      const audio = new Audio(
        next ? "/audio/switch-off.mp3" : "/audio/switch-on.mp3",
      );
      audio.play();
      localStorage.setItem("darkMode", next);
      return next;
    });
  };

  const theme = isDark ? "dark" : "light";

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
