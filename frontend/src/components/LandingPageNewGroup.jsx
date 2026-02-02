import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const LandingPageNewGroup = () => {
  const [joinOptionSelector, setJoinOptionSelector] = useState(0);
  const [animating, setAnimating] = useState(false);
  const { theme } = useContext(ThemeContext);

  const changeOption = (newIndex) => {
    if (newIndex === joinOptionSelector) return;

    setAnimating(true);

    setTimeout(() => {
      setJoinOptionSelector(newIndex);
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="mt-10 flex items-center px-2">
      <div className="w-full transition-all duration-300">
        <div className="-rotate-3 w-fit mx-auto">
          <div
            className={`
            transition-all duration-300 ease-in-out
            ${animating ? "opacity-0 -rotate-3 scale-95" : "opacity-100 rotate-0 scale-100"}
          `}
          >
            <img
              src={`/heropage/Step1/hero-newgroup0-${theme}.png`}
              alt=""
              className={`object-fill rounded-lg shadow-2xl shadow-gray-500 dark:shadow-blue-500/90 mx-auto ${joinOptionSelector === 0 ? "block" : "hidden"}`}
            />
            <img
              src={`/heropage/Step1/hero-newgroup1-${theme}.png`}
              alt=""
              className={`object-fill rounded-lg shadow-2xl shadow-gray-500 dark:shadow-blue-500/90 mx-auto ${joinOptionSelector === 1 ? "block" : "hidden"}`}
            />
            <img
              src={`/heropage/Step1/hero-newgroup2-${theme}.png`}
              alt=""
              className={`object-fill rounded-lg shadow-2xl shadow-gray-500 dark:shadow-blue-500/90 mx-auto ${joinOptionSelector === 2 ? "block" : "hidden"}`}
            />
          </div>
        </div>
      </div>
      <div className="w-full justify-center">
        <ul className="gap-5 pl-5 flex flex-col">
          <li
            className={
              "py-1 px-2 cursor-pointer border border-light-border dark:border-dark-border rounded-full " +
              (joinOptionSelector === 0
                ? "ring ring-gray-500 dark:ring-blue-500"
                : "")
            }
            onClick={() => changeOption(0)}
          >
            Öffne das Menü oben links
          </li>
          <li
            className={
              "py-1 px-2 cursor-pointer border border-light-border dark:border-dark-border rounded-full " +
              (joinOptionSelector === 1
                ? "ring ring-gray-500 dark:ring-blue-500"
                : "")
            }
            onClick={() => changeOption(1)}
          >
            Klicke auf "Neue Gruppe"
          </li>
          <li
            className={
              "py-1 px-2 cursor-pointer border border-light-border dark:border-dark-border rounded-full " +
              (joinOptionSelector === 2
                ? "ring ring-gray-500 dark:ring-blue-500"
                : "")
            }
            onClick={() => changeOption(2)}
          >
            Erstelle deine Gruppe
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LandingPageNewGroup;
