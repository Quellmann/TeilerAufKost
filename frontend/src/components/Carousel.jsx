import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";
import Statistics from "./Statistics";
import Balancing from "./Balancing";
import Summary from "./Summary";
import Spendings from "./Spendings";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Options from "./Options";

const Carousel = ({ personData, spendings, groupMembers }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ watchDrag: false }, [
    AutoHeight(),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(2);
    }
  }, [emblaApi]);

  return (
    <div className="overflow-hidden pt-6 pb-2 relative" ref={emblaRef}>
      <div className="flex gap-5 px-2 items-start transition-[height] duration-300">
        <div className="flex-none w-full min-w-0">
          <div className="flex justify-center text-xl mb-5">
            Ausgleichszahlungen
          </div>
          <Balancing
            personData={personData}
            groupMembers={groupMembers}
          ></Balancing>
        </div>
        <div className="flex-none w-full min-w-0">
          <div className="flex justify-center text-xl mb-5">
            Zusammenfassung
          </div>
          <Summary personData={personData} emblaApi={emblaApi}></Summary>
        </div>
        <div className="flex-none w-full min-w-0">
          <div className="flex justify-center text-xl mb-5">
            Ausgaben-Historie
          </div>
          <Spendings spendings={spendings} innerEmblaApi={emblaApi}></Spendings>
        </div>
        <div className="flex-none w-full min-w-0">
          <div className="flex justify-center text-xl mb-5">Statistik</div>
          <Statistics
            personData={personData}
            spendings={spendings}
          ></Statistics>
        </div>
        <div className="flex-none w-full min-w-0 mr-2">
          <div className="flex justify-center text-xl mb-5">Optionen</div>
          <Options></Options>
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute top-5 left-0 rounded-full p-1"
      >
        <ChevronLeftIcon className="w-6 translate-x-3"></ChevronLeftIcon>
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-5 right-0 rounded-full p-1"
      >
        <ChevronRightIcon className="w-6 -translate-x-3"></ChevronRightIcon>
      </button>
      <div className="absolute top-2 flex space-x-2 w-full justify-center">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "bg-dark-border dark:bg-dark-text"
                : "bg-light-border dark:bg-dark-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
