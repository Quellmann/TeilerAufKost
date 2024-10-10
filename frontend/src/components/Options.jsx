import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";

const Options = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex p-3 justify-center items-center border rounded-lg hover:bg-yellow-400 cursor-pointer text-xl">
        <ArrowPathIcon className="size-6 mr-3"></ArrowPathIcon>
        Ausgaben zurücksetzen
      </div>
      <div className="flex p-3 justify-center items-center border rounded-lg hover:bg-red-400 cursor-pointer text-xl">
        <TrashIcon className="size-6 mr-3"></TrashIcon>
        Gruppe löschen
      </div>
    </div>
  );
};

export default Options;
