import { useState, useRef, useEffect } from "react";

const LandingPageJoinGroup = ({ joinOption }) => {
  const [joinOptionSelector, setJoinOptionSelector] = useState(0);
  const [animating, setAnimating] = useState(false);

  const preloadedRef = useRef(new Set());

  const newGroupImages = [
    {
      dark: "/heropage/hero-groupjoin-dark.png",
      light: "/heropage/hero-groupjoin-light.png",
    },
    {
      dark: "/heropage/hero-groupjoin2-dark.png",
      light: "/heropage/hero-groupjoin2-light.png",
    },
    {
      dark: "/heropage/hero-groupjoin3-dark.png",
      light: "/heropage/hero-groupjoin3-light.png",
    },
  ];

  const joinGroupImages = [
    {
      dark: "/heropage/hero-groupjoin4-dark.png",
      light: "/heropage/hero-groupjoin4-light.png",
    },
    {
      dark: "/heropage/hero-groupjoin5-dark.png",
      light: "/heropage/hero-groupjoin5-light.png",
    },
    {
      dark: "/heropage/hero-groupjoin6-dark.png",
      light: "/heropage/hero-groupjoin6-light.png",
    },
  ];

  useEffect(() => {
    // Preload all images so switching is instant (cached in memory)
    joinGroupImages.forEach((imgObj) => {
      [imgObj.dark, imgObj.light].forEach((src) => {
        if (!preloadedRef.current.has(src)) {
          const img = new Image();
          img.src = src;
          preloadedRef.current.add(src);
        }
      });
    });
  }, []);

  useEffect(() => {
    setJoinOptionSelector(0);
  }, [joinOption]);

  const changeOption = (newIndex) => {
    if (newIndex === joinOptionSelector) return;

    setAnimating(true); // start fade/rotate out

    setTimeout(() => {
      setJoinOptionSelector(newIndex); // switch image mid-animation
      setAnimating(false); // animate back in
    }, 300); // must match exit duration
  };

  if (joinOption === 0) {
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
              {/* Dark */}
              <img
                src={newGroupImages[joinOptionSelector].dark}
                loading="eager"
                decoding="async"
                alt=""
                className="object-fill rounded-lg hidden dark:block shadow-2xl shadow-blue-500/90 mx-auto"
              />

              {/* Light */}
              <img
                src={newGroupImages[joinOptionSelector].light}
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
  } else {
    return (
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
              Auf den QR-Code drücken
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
              Code abscannen oder Link teilen
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
              Der bestehenden Gruppe betreten
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
                src={joinGroupImages[joinOptionSelector].dark}
                loading="eager"
                decoding="async"
                alt=""
                className="object-fill rounded-lg hidden dark:block shadow-2xl shadow-blue-500/90 mx-auto"
              />

              {/* Light */}
              <img
                src={joinGroupImages[joinOptionSelector].light}
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
  }
};

export default LandingPageJoinGroup;
