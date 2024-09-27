import React, { useRef, useEffect, useState } from 'react'
import { Bars3Icon } from "@heroicons/react/24/solid"
import Sidebar from './Sidebar'

const Header = ({ refresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const burgerRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !(sidebarRef.current.contains(event.target) || burgerRef.current.contains(event.target))) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Add event listener to detect clicks outside the sidebar
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove event listener when sidebar is closed
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative bg-gray-200">
      <button
        ref={burgerRef}
        className="absolute m-2 p-2 top-4 left-0 hover:bg-slate-300 rounded-lg"
        onClick={toggleSidebar}
      >
        <Bars3Icon className='size-8'></Bars3Icon>
      </button>
      <div className='flex justify-center py-2 items-center'>
        <div className='w-20 h-20 rounded-full overflow-hidden mr-5 '>
          <img src='/logo.jpg' className='w-full h-full object-cover translate-x-[1px] translate-y-[1px] transform scale-[145%]'></img>

        </div>
        <div className='text-2xl font-thin'>TeilerAufKost</div>

      </div>
      <Sidebar refresh={refresh} sidebarRef={sidebarRef} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

export default Header