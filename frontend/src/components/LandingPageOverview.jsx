import { useState } from "react";

const LandingPageOverview = ({ joinOption }) => {
  const [joinOptionSelector, setJoinOptionSelector] = useState(0);
  const [animating, setAnimating] = useState(false);

  const overviewImages = [
    {
      dark: "/heropage/hero-overview-dark.png",
      light: "/heropage/hero-overview-light.png",
    },
    {
      dark: "/heropage/hero-overview1-dark.png",
      light: "/heropage/hero-overview1-light.png",
    },
    {
      dark: "/heropage/hero-overview2-dark.png",
      light: "/heropage/hero-overview2-light.png",
    },
    {
      dark: "/heropage/hero-overview3-dark.png",
      light: "/heropage/hero-overview3-light.png",
    },
    {
      dark: "/heropage/hero-overview4-dark.png",
      light: "/heropage/hero-overview4-light.png",
    },
  ];

  const changeOption = (newIndex) => {
    if (newIndex === joinOptionSelector) return;

    setAnimating(true); // start fade/rotate out

    setTimeout(() => {
      setJoinOptionSelector(newIndex); // switch image mid-animation
      setAnimating(false); // animate back in
    }, 300); // must match exit duration
  };

  return joinOption === 0 ? (
    <div className="mt-10 flex items-center px-2">
      <div className="w-full transition-all duration-300">
        <div className="-rotate-3 w-fit mx-auto">
          <div
            className={`
            transition-all duration-300 ease-in-out
            ${animating ? "opacity-0 -rotate-3 scale-95" : "opacity-100 rotate-0 scale-100"}
          `}
          >
            {/* Dark */}
            <img
              src={overviewImages[joinOptionSelector].dark}
              loading="eager"
              decoding="async"
              alt=""
              className="object-fill rounded-lg hidden dark:block shadow-2xl shadow-blue-500/90 mx-auto"
            />

            {/* Light */}
            <img
              src={overviewImages[joinOptionSelector].light}
              loading="eager"
              decoding="async"
              alt=""
              className="object-cover rounded-lg dark:hidden shadow-2xl shadow-gray-500 mx-auto"
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
            Ausgleichzahlungen
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
            Zusammenfassung
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
            Ausgaben-Historie
          </li>
          <li
            className={
              "py-1 px-2 cursor-pointer border border-light-border dark:border-dark-border rounded-full " +
              (joinOptionSelector === 3
                ? "ring ring-gray-500 dark:ring-blue-500"
                : "")
            }
            onClick={() => changeOption(3)}
          >
            Statistiken
          </li>
          <li
            className={
              "py-1 px-2 cursor-pointer border border-light-border dark:border-dark-border rounded-full " +
              (joinOptionSelector === 4
                ? "ring ring-gray-500 dark:ring-blue-500"
                : "")
            }
            onClick={() => changeOption(4)}
          >
            Haushaltsansicht
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <div className="mt-10 flex items-center px-2">
      <div className="w-full justify-center">
        <ul className="gap-5 pr-5 flex flex-col">
          <li
            className={
              "py-1 px-2 cursor-pointer border border-light-border dark:border-dark-border rounded-full " +
              (joinOptionSelector === 0
                ? "ring ring-gray-500 dark:ring-blue-500"
                : "")
            }
            onClick={() => changeOption(0)}
          >
            Ausgleichzahlungen
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
            Zusammenfassung
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
            Ausgaben-Historie
          </li>
          <li
            className={
              "py-1 px-2 cursor-pointer border border-light-border dark:border-dark-border rounded-full " +
              (joinOptionSelector === 3
                ? "ring ring-gray-500 dark:ring-blue-500"
                : "")
            }
            onClick={() => changeOption(3)}
          >
            Statistiken
          </li>
          <li
            className={
              "py-1 px-2 cursor-pointer border border-light-border dark:border-dark-border rounded-full " +
              (joinOptionSelector === 4
                ? "ring ring-gray-500 dark:ring-blue-500"
                : "")
            }
            onClick={() => changeOption(4)}
          >
            Optionen
          </li>
        </ul>
      </div>
      <div className="w-full transition-all duration-300">
        <div className="rotate-3 w-fit mx-auto">
          <div
            className={`
            transition-all duration-300 ease-in-out
            ${animating ? "opacity-0 -rotate-3 scale-95" : "opacity-100 rotate-0 scale-100"}
          `}
          >
            {/* Dark */}
            <img
              src={overviewImages[joinOptionSelector].dark}
              loading="eager"
              decoding="async"
              alt=""
              className="object-fill rounded-lg hidden dark:block shadow-2xl shadow-blue-500/90 mx-auto"
            />

            {/* Light */}
            <img
              src={overviewImages[joinOptionSelector].light}
              loading="eager"
              decoding="async"
              alt=""
              className="object-cover rounded-lg dark:hidden shadow-2xl shadow-gray-500 mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageOverview;
