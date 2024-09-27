import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { PaperAirplaneIcon, PlusIcon, ShoppingBagIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { Link, useParams } from 'react-router-dom'

export default function AddPopover() {
    const { groupId } = useParams()

    return (
        <Popover className="flex">
            <PopoverButton className="hover:bg-slate-300 pt-2 pb-1 px-4 rounded-lg items-center text-sm/6 font-semibold focus:outline-none ">
                <PlusIcon className='size-8'></PlusIcon>
            </PopoverButton>
            <PopoverPanel
                transition
                anchor="bottom"
                className="rounded-xl bg-white border transition duration-200 ease-in-out -translate-y-10 [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
                <div className="divide-y flex flex-col">
                    <Link to={groupId + "/newSpending"} className='flex items-center px-6 py-2 space-x-4 hover:bg-slate-300 cursor-pointer'>
                        <ShoppingBagIcon className='size-6'></ShoppingBagIcon>
                        <div className='flex flex-col'>
                            Neue Ausgabe
                            <div className='font-thin text-sm'>
                                Jemand hat etwas eingekauft
                            </div>
                        </div>
                    </Link >
                    <Link to={groupId + "/newTransaction"} className='flex items-center px-6 py-2 space-x-4 hover:bg-slate-300 cursor-pointer'>
                        <PaperAirplaneIcon className='size-6'></PaperAirplaneIcon>
                        <div className='flex flex-col'>
                            Neue Zahlung
                            <div className='font-thin text-sm'>
                                Jemand hat Geld erhalten
                            </div>
                        </div>
                    </Link >
                    <Link to={groupId + "/newPerson"} className='flex items-center px-6 py-2 space-x-4 hover:bg-slate-300 cursor-pointer'>
                        <UserPlusIcon className='size-6'></UserPlusIcon>
                        <div className='flex flex-col'>
                            Neue Person
                            <div className='font-thin text-sm'>
                                Jemanden hinzufügen
                            </div>
                        </div>
                    </Link >
                </div>
            </PopoverPanel>
        </Popover>
    )
}