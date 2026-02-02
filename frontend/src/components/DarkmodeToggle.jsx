import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const DarkmodeToggle = () => {
  const { isDark, toggle } = useContext(ThemeContext);

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-sky-900 group"
    >
      {isDark ? (
        <SunIcon className="h-6 w-6 text-slate-200 dark:group-hover:text-sky-400"></SunIcon>
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-900"></MoonIcon>
      )}
    </button>
  );
};

export default DarkmodeToggle;
