import { Dialog, DialogPanel } from "@headlessui/react";
import { LinkIcon } from "@heroicons/react/24/outline";
import { QRCodeSVG } from "qrcode.react";

const QRCodeModal = ({ isOpenQR, setIsOpenQR, qrCodeUrl }) => {
  const handleShareClick = async () => {
    const webAppUrl = window.location.href; // Get current page URL

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        // Use the Web Share API for mobile sharing options
        await navigator.share({
          title: "Check out this app!",
          text: "Here is the link to the app:",
          url: webAppUrl,
        });
        console.log("Successfully shared");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // If Web Share API is not available, fall back to Clipboard API
      try {
        await navigator.clipboard.writeText(webAppUrl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
        alert("Unable to copy link");
      }
    }
  };

  return (
    <Dialog
      open={isOpenQR}
      as="div"
      className="relative z-30 focus:outline-none"
      onClose={() => setIsOpenQR(false)}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex flex-col min-h-full items-center justify-center bg-black/50 duration-300 p-4">
          <DialogPanel
            transition
            className="p-6 duration-200 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div id="qr_code" className="bg-white p-4 rounded-lg border">
              <QRCodeSVG size="300" value={qrCodeUrl} />
            </div>
            <div
              onClick={() => handleShareClick()}
              className="rounded-lg bg-white flex items-center hover:bg-slate-300 cursor-pointer mt-4 justify-center"
            >
              <LinkIcon className="w-8 m-2"></LinkIcon>
              <div className="p-2">Gruppe teilen</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default QRCodeModal;
