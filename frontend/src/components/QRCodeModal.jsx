import { Dialog, DialogPanel } from '@headlessui/react'
import { QRCodeSVG } from "qrcode.react"

const QRCodeModal = ({ isOpenQR, setIsOpenQR, qrCodeUrl }) => {
    return (
        <Dialog open={isOpenQR} as="div" className="relative z-30 focus:outline-none" onClose={() => setIsOpenQR(false)}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center bg-black/50 duration-300 p-4">
                    <DialogPanel
                        transition
                        className="p-6 duration-200 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <div id="qr_code" className="bg-white p-4 rounded-lg border">
                            <QRCodeSVG size="300" value={qrCodeUrl} />
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default QRCodeModal;
