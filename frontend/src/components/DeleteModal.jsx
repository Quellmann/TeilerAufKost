import { Dialog, DialogPanel } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";

const DeleteModal = ({ text, isOpen, setIsOpen, callback }) => {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-30 focus:outline-none"
      onClose={() => setIsOpen(false)}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto text-light-text dark:text-dark-text">
        <div className="flex flex-col min-h-full items-center justify-center bg-black/70 duration-300 p-4">
          <DialogPanel
            transition
            className="p-6 duration-200 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="rounded-lg flex flex-col items-center justify-center border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card ">
              <XCircleIcon className="size-20 text-red-500 my-6"></XCircleIcon>
              <div className="p-2 text-3xl">Bist du sicher?</div>
              <div className="p-2 text-lg text-center">{text}</div>
              <div className="p-2 text-lg text-center">
                Du kannst diese Aktion nicht rückgängig machen.
              </div>
              <div className="flex justify-between w-full px-5 pb-5 pt-10">
                <div
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-2 cursor-pointer border border-light-border dark:border-dark-border"
                >
                  Abbrechen
                </div>
                <div
                  onClick={() => {
                    setIsOpen(false);
                    callback();
                  }}
                  className="rounded-lg px-4 py-2 text-white bg-red-500 cursor-pointer border border-light-border dark:border-dark-border"
                >
                  Löschen
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteModal;
