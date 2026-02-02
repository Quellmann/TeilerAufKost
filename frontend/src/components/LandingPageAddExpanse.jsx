import { useState } from "react";

const LandingPageAddExpanse = ({ joinOption }) => {
  const [joinOptionSelector, setJoinOptionSelector] = useState(0);
  const [animating, setAnimating] = useState(false);

  const addExpanseImages = [
    {
      dark: "/heropage/hero-addexpanse-dark.png",
      light: "/heropage/hero-addexpanse-light.png",
    },
    {
      dark: "/heropage/hero-addexpanse1-dark.png",
      light: "/heropage/hero-addexpanse1-light.png",
    },
    {
      dark: "/heropage/hero-addexpanse2-dark.png",
      light: "/heropage/hero-addexpanse2-light.png",
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

  return joinOption === 1 ? (
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
              src={addExpanseImages[joinOptionSelector].dark}
              loading="eager"
              decoding="async"
              alt=""
              className="object-fill rounded-lg hidden dark:block shadow-2xl shadow-blue-500/90 mx-auto"
            />

            {/* Light */}
            <img
              src={addExpanseImages[joinOptionSelector].light}
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
            Öffne eine neue Ausgabe
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
            Ergänze Titel und Betrag
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
            Wähle Bezahler und Empfänger
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
            Öffne eine neue Ausgabe
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
            Ergänze Titel und Betrag
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
            Wähle Bezahler und Empfänger
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
              src={addExpanseImages[joinOptionSelector].dark}
              loading="eager"
              decoding="async"
              alt=""
              className="object-fill rounded-lg hidden dark:block shadow-2xl shadow-blue-500/90 mx-auto"
            />

            {/* Light */}
            <img
              src={addExpanseImages[joinOptionSelector].light}
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

export default LandingPageAddExpanse;
