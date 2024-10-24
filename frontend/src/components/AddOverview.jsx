import React from "react";
import { useCallback } from "react";
import {
  ArrowUturnLeftIcon,
  PaperAirplaneIcon,
  ShoppingBagIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams, useNavigate } from "react-router-dom";

const AddOverview = ({ emblaApi }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const backButton = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const forwardButton = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const setType = (type) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("type", type);
    setSearchParams(newParams);
  };

  return (
    <div className="m-1">
      <div>
        <button
          onClick={() => backButton()}
          className="flex items-center p-1 border rounded-lg"
        >
          <ArrowUturnLeftIcon className="size-6"></ArrowUturnLeftIcon>
          <div className="ml-3">Zurück</div>
        </button>
      </div>
      <div className="divide-y flex flex-col border rounded-lg mt-10 overflow-hidden">
        <button
          onClick={() => {
            setType("spending");
            forwardButton();
          }}
          className="flex items-center px-3 py-2 space-x-4 hover:bg-slate-300 cursor-pointer text-left"
        >
          <ShoppingBagIcon className="size-6"></ShoppingBagIcon>
          <div className="flex flex-col">
            Neue Ausgabe
            <div className="font-thin text-sm">
              Jemand hat etwas für die Gruppe eingekauft
            </div>
          </div>
        </button>
        <button
          onClick={() => {
            setType("transaction");
            forwardButton();
          }}
          className="flex items-center px-3 py-2 space-x-4 hover:bg-slate-300 cursor-pointer text-left"
        >
          <PaperAirplaneIcon className="size-6"></PaperAirplaneIcon>
          <div className="flex flex-col">
            Neue Zahlung
            <div className="font-thin text-sm">
              Jemand hat einem Gruppenmitglied Geld gegeben
            </div>
          </div>
        </button>
        <button
          onClick={() => {
            setType("person");
            forwardButton();
          }}
          className="flex items-center px-3 py-2 space-x-4 hover:bg-slate-300 cursor-pointer text-left"
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

export default AddOverview;
