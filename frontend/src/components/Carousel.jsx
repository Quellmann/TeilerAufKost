import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Statistics from "./Statistics";
import Balancing from "./Balancing";
import Summary from "./Summary";
import Spendings from "./Spendings";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Options from "./Options";

const Carousel = ({ personData, spendings }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
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
    <div className="overflow-hidden my-5 pt-5 border-t relative" ref={emblaRef}>
      <div className="flex gap-5">
        <div className="flex-none w-full min-w-0">
          <div className="flex justify-center text-xl mb-5">
            Ausgleichszahlungen
          </div>
          <Balancing personData={personData}></Balancing>
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
          <Spendings spendings={spendings}></Spendings>
        </div>
        <div className="flex-none w-full min-w-0">
          <div className="flex justify-center text-xl mb-5">Statistik</div>
          <Statistics
            personData={personData}
            spendings={spendings}
          ></Statistics>
        </div>
        <div className="flex-none w-full min-w-0">
          <div className="flex justify-center text-xl mb-5">Optionen</div>
          <Options></Options>
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute top-5 left-0 hover:bg-slate-200 rounded-full p-1"
      >
        <ChevronLeftIcon className="w-6 -translate-x-0.5"></ChevronLeftIcon>
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-5 right-0 hover:bg-slate-200 rounded-full p-1"
      >
        <ChevronRightIcon className="w-6 translate-x-0.5"></ChevronRightIcon>
      </button>
      <div className="absolute top-2 flex space-x-2 w-full justify-center">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index ? "bg-slate-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
