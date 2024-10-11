import React from "react";
import Overview from "../pages/Overview";
import { useCallback } from "react";
import {
  ArrowUturnLeftIcon,
  PaperAirplaneIcon,
  ShoppingBagIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";

const AddPage = ({ emblaApi, setAddType }) => {
  const backButton = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const forwardButton = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="">
      <div>
        <button
          onClick={() => backButton()}
          className="flex items-center p-1 border rounded-lg"
        >
          <ArrowUturnLeftIcon className="size-6"></ArrowUturnLeftIcon>
          Zurück
        </button>
      </div>
      <div className="divide-y flex flex-col border rounded-lg mt-10">
        <button
          onClick={() => {
            setAddType("spending");
            forwardButton();
          }}
          className="flex items-center px-6 py-2 space-x-4 hover:bg-slate-300 cursor-pointer text-left"
        >
          <ShoppingBagIcon className="size-6"></ShoppingBagIcon>
          <div className="flex flex-col">
            Neue Ausgabe
            <div className="font-thin text-sm">Jemand hat etwas eingekauft</div>
          </div>
        </button>
        <button
          onClick={() => {
            setAddType("transaction");
            forwardButton();
          }}
          className="flex items-center px-6 py-2 space-x-4 hover:bg-slate-300 cursor-pointer text-left"
        >
          <PaperAirplaneIcon className="size-6"></PaperAirplaneIcon>
          <div className="flex flex-col">
            Neue Zahlung
            <div className="font-thin text-sm">Jemand hat Geld erhalten</div>
          </div>
        </button>
        <button
          onClick={() => {
            setAddType("person");
            forwardButton();
          }}
          className="flex items-center px-6 py-2 space-x-4 hover:bg-slate-300 cursor-pointer text-left"
        >
          <UserPlusIcon className="size-6"></UserPlusIcon>
          <div className="flex flex-col">
            Neue Person
            <div className="font-thin text-sm">Jemanden hinzufügen</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AddPage;
