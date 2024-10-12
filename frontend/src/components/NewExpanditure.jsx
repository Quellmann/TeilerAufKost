import React from "react";

import NewSpending from "../pages/NewSpending";
import NewTransaction from "../pages/NewTransaction";
import NewPerson from "../pages/NewPerson";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

const NewExpanditure = ({ addType, emblaApi }) => {
  const renderType = () => {
    switch (addType) {
      case "spending":
        return <NewSpending emblaApi={emblaApi}></NewSpending>;
      case "transaction":
        return <NewTransaction emblaApi={emblaApi}></NewTransaction>;
      case "person":
        return <NewPerson emblaApi={emblaApi}></NewPerson>;
      case "":
        return <div>Bad input</div>;
    }
  };
  return (
    <div className="">
      <button
        onClick={() => emblaApi.scrollPrev()}
        className="flex items-center p-1 border rounded-lg mb-8"
      >
        <ArrowUturnLeftIcon className="size-6"></ArrowUturnLeftIcon>
        <div className="ml-3">Zurück</div>
      </button>
      {renderType()}
    </div>
  );
};

export default NewExpanditure;
