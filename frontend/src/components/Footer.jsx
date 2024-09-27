import { BanknotesIcon, HomeIcon, PlusIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useState } from 'react'
import AddPopover from './AddPopover'
import { Link, useParams } from 'react-router-dom'

const Footer = () => {
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const { groupId } = useParams();

  return (

    <div className='w-full h-[72px] z-20 pt-2 pb-1 bg-gray-200 '>
      <div className='flex justify-between 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] mx-auto'>
        {groupId && (
          <>
            <Link to={groupId} className='flex flex-col items-center hover:bg-slate-300 pt-2 pb-1 px-2 rounded-lg'>
              <HomeIcon className='size-6'></HomeIcon>
              <span className='font-thin'>Übersicht</span>
            </Link>
            <AddPopover isOpenAdd={isOpenAdd}></AddPopover>
            <Link to={groupId ? `${groupId}/spendings` : "/"} className='flex flex-col items-center hover:bg-slate-300 pt-2 pb-1 px-2 rounded-lg'>
              <BanknotesIcon className='size-6'></BanknotesIcon>
              <span className='font-thin'>Ausgaben</span>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
export default Footer