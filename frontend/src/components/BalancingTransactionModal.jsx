import React from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router-dom";

const BalancingTransactionModal = ({
  isOpen,
  setIsOpen,
  form,
  setForm,
  callback,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
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
              <QuestionMarkCircleIcon className="size-20 text-green-500 my-6"></QuestionMarkCircleIcon>
              <div className="p-2 text-3xl">Transaktion oder Verbrauch?</div>
              <div>
                <div className="px-5 pt-10 text-lg">
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      callback();
                    }}
                    className="border rounded-lg p-1 hover:bg-slate-300 cursor-pointer"
                  >
                    Verbauch:
                    <div className="text-base">
                      Wenn du für eine Person ein Glas Wasser bestellst.
                    </div>
                  </div>
                </div>
                <div className="px-5 pt-5 pb-10 text-lg">
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      const newForm = { ...form, isBalancingTransaction: true };
                      // setForm((prev) => ({
                      //   ...prev,
                      //   isBalancingTransaction: true,
                      // }));
                      callback(newForm);
                    }}
                    className="border rounded-lg p-1 hover:bg-slate-300 cursor-pointer"
                  >
                    Transaktion:
                    <div className="text-base">
                      Wenn du einer Person 20€ gibst, um gemeinsam eine Rechnung
                      zu bezahlen.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default BalancingTransactionModal;
