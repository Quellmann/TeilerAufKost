import React, { useState, useEffect } from 'react'
import { Input } from '@headlessui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from "../config";


const NewPerson = () => {
    const [memberInput, setMemberInput] = useState("");
    const [groupMember, setGroupMember] = useState([])
    const [data, setData] = useState({})
    const { groupId } = useParams()
    const navigate = useNavigate();

    const submitForm = async () => {
        const response = await fetch(`${API_BASE_URL}/${groupId}/updateGroup`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ groupMember: groupMember })
        })
        const group = await response.json()
        navigate(`/${group._id}`)
    }

    useEffect(() => {
        async function fetchData() {
            const groupResponse = await fetch(`${API_BASE_URL}/${groupId}`);
            if (!groupResponse.ok) {
                const message = `An error has occurred: ${groupResponse.statusText}`;
                console.error(message);
                return;
            }
            const data = await groupResponse.json();
            if (!data) {
                console.warn(`Data not found`);
                navigate("/");

            }
            setData(data)
        }
        fetchData()
        return;
    }, []);

    return (
        <div className='flex-1 overflow-y-auto mt-16 mb-16 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] mx-auto'>
            <form className='mt-10 flex flex-col' autoComplete='off'>
                <div className='text-xl mb-8 pl-3'>
                    Neue Person hinzufügen
                </div>
                <div className='text-lg mt-10 relative'>
                    <Input value={memberInput} onChange={(e) => setMemberInput(e.target.value)} placeholder='Personen' className="border w-full rounded-lg p-2 h-10 text-center" name="spending_amount" type="text" min="0" />
                    <div onClick={() => { setGroupMember(prevState => ([...prevState, memberInput])); setMemberInput("") }} className='absolute cursor-pointer border-l rounded-lg py-2 px-8 right-0 top-0 h-10 hover:bg-slate-200 hover:outline outline-2 -outline-offset-[3px] outline-black '>
                        <UserPlusIcon className='size-6'></UserPlusIcon>
                    </div>
                </div>
                <div className='grid grid-cols-1 my-5 border rounded-lg divide-y mx-auto'>
                    {data.groupMember?.map((member, index) => <div key={index} className='py-1 grid grid-cols-3'>
                        <div className='pl-2 '>{index + 1 + "."}</div>
                        <div className='w-28'>{member}</div>
                    </div>)}
                    {groupMember.map((member, index) => <div key={index} className='py-1 grid grid-cols-3'>
                        <div className='pl-2 '>{data.groupMember.length + index + 1 + "."}</div>
                        <div className='w-28'>{member}</div>
                        <div className='justify-self-end mr-2 cursor-pointer hover:bg-slate-200 rounded-full' onClick={() => setGroupMember(groupMember.filter((person, idx) => idx != index))}>
                            <XMarkIcon className='size-6'></XMarkIcon>
                        </div>
                    </div>)}
                </div>
            </form>
            <div className='absolute flex bottom-24 left-1/2 -translate-x-1/2 justify-center'>
                <button onClick={submitForm} className='rounded-lg bg-slate-200 hover:bg-green-400 transition-colors py-2 px-20'>
                    Speichern
                </button>
            </div>
        </div>
    )
}

export default NewPerson