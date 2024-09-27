import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../config";
import { AdjustmentsHorizontalIcon, ArrowLeftStartOnRectangleIcon, PencilIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ refresh, isOpen, setIsOpen, sidebarRef }) => {

    const [groups, setGroups] = useState([]);
    const [edit, setEdit] = useState(false);
    const navigate = useNavigate()

    function getGroupSubscription() {
        return JSON.parse(localStorage.getItem('groupSubscription'));
    }

    function deleteGroupSubscription(groupId) {
        const subscribedGroups = JSON.parse(localStorage.getItem('groupSubscription'))
        if (subscribedGroups.includes(groupId)) {
            localStorage.setItem('groupSubscription', JSON.stringify(subscribedGroups.filter((group) => group != groupId)));
            navigate("/")
        }
    }

    const refreshPage = () => {
        refresh.current = new Date()
    }

    useEffect(() => {
        if (!isOpen) {
            setEdit(false)
        }
    }, [isOpen])

    useEffect(() => {
        async function fetchGroups() {
            const subscribedGroups = getGroupSubscription()
            // const response = await fetch(`${API_BASE_URL}/groups`);
            const response = await fetch(`${API_BASE_URL}/groups?groupIds=${JSON.stringify(subscribedGroups)}`);
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const data = await response.json();
            if (!data) {
                console.warn(`Data not found`);
            }
            setGroups(data)
        }
        fetchGroups();
        return;
    }, [refresh.current]);

    return (
        <div ref={sidebarRef}
            className={`fixed left-0 h-full w-64 z-10 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="p-4">
                <div className='flex justify-between items-center mb-4'>
                    <div className="text-xl font-bold">Gruppen</div>
                    <div className={`rounded-full p-1 ${edit ? 'bg-slate-200 text-black' : 'hover:bg-slate-200 hover:text-black'} cursor-pointer`}>
                        <AdjustmentsHorizontalIcon onClick={() => setEdit(!edit)} className='w-6 h-6'></AdjustmentsHorizontalIcon>
                    </div>
                </div>
                <ul className={`flex flex-col`}>
                    {groups.map((element) => (
                        <li key={element._id} className={`my-1 font-thin flex h-10 items-center relative ${!edit && ''} rounded-lg w-full border overflow-hidden`}>
                            <div className={`absolute flex h-10 `}>
                                <div onClick={() => { deleteGroupSubscription(element._id), setIsOpen(false), refreshPage() }} className={`flex items-center px-2 bg-red-600 cursor-pointer transform transition duration-300 ease-in-out ${edit ? 'translate-x-0' : '-translate-x-[146px]'}`}>
                                    <ArrowLeftStartOnRectangleIcon className='size-6 '></ArrowLeftStartOnRectangleIcon>
                                </div>
                                <div onClick={() => { setIsOpen(false), setEdit(false) }} className={`flex border items-center px-10 bg-green-500 cursor-pointer transform transition duration-300 ease-in-out ${edit ? 'translate-x-0' : '-translate-x-[146px]'}`}>
                                    <PencilIcon className='size-6'></PencilIcon>
                                </div>
                            </div>
                            <Link to={element._id} onClick={() => { setIsOpen(false), setEdit(false) }} className={`w-full h-full flex items-center pl-2 hover:text-gray-900 hover:bg-slate-300 transform transition duration-300 ease-in-out ${edit ? 'translate-x-[146px]' : '-translate-x-146'}`}>
                                <div className='truncate text-lg'>
                                    {element.groupName}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
                <Link to="/newGroup" onClick={() => setIsOpen(false)} className='absolute bottom-48 left-5 rounded-lg text-black bg-slate-200 hover:bg-slate-400 py-2 px-14'>Neue Gruppe</Link>
            </div>
        </div >
    )
}

export default Sidebar