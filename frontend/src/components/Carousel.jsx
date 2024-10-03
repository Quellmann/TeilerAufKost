import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Statistics from "./Statistics";
import Balancing from "./Balancing";
import Summary from "./Summary";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Carousel = ({ personData }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
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
          <Summary personData={personData}></Summary>
        </div>
        <div className="flex-none w-full min-w-0">
          <div className="flex justify-center text-xl mb-5">Statistik</div>
          <Statistics></Statistics>
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
    </div>
  );
};

export default Carousel;
