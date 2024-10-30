import React from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const AcceptModal = ({ modalData, isOpen, setIsOpen, callback }) => {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-30 focus:outline-none"
      onClose={() => setIsOpen(false)}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex flex-col min-h-full items-center justify-center bg-black/50 duration-300 p-4">
          <DialogPanel
            transition
            className="p-6 duration-200 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="rounded-lg bg-white flex flex-col items-center justify-center">
              <div className="p-2 text-2xl">{modalData.title}</div>
              <ExclamationTriangleIcon className="size-10 text-yellow-400"></ExclamationTriangleIcon>
              <div className="p-2 text-lg text-center">{modalData.text1}</div>
              <div className="p-2 text-lg text-center">{modalData.text2}</div>
              <div className="flex justify-between w-full px-5 pb-5 pt-10">
                <div
                  onClick={callback}
                  className="rounded-lg border px-4 py-2 hover:bg-red-400 cursor-pointer"
                >
                  {modalData.button}
                </div>
                <div
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border px-4 py-2 hover:bg-slate-300 cursor-pointer"
                >
                  Abbrechen
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AcceptModal;
