import React, { useState, useEffect } from 'react'
import { Input } from '@headlessui/react';
import ComboInput from '../components/ComboInput';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const NewTransaction = () => {
    const [data, setData] = useState([]);
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "Zahlung",
        amount: "",
        from: "",
        to: [],
    })

    const submitForm = async () => {
        const response = await fetch(`${API_BASE_URL}/${groupId}/newSpending`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        })
        const group = await response.json()
        navigate("/" + group.groupId)
    }

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`${API_BASE_URL}/${groupId}`);
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const data = await response.json();
            if (!data) {
                console.warn(`Data not found`);
                navigate("/");

            }
            setData(data)
        }
        (groupId && fetchData())
        return;
    }, [groupId]);

    return (
        <div className='flex-1 overflow-y-auto mt-16 mb-16 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] mx-auto'>
            <form className='mt-10 flex flex-col' autoComplete='off'>
                <div className='text-xl mb-8 pl-3'>
                    Neue Zahlung hinzufügen
                </div>
                <div className='text-lg pl-3 mt-3'>
                    <Input onChange={(e) => setForm(prevState => ({ ...prevState, amount: parseFloat(e.target.value) }))} placeholder='Betrag' className="border w-full rounded-lg p-2 text-center" name="spending_amount" type="number" min="0" />
                </div>
                <div className='text-lg pl-3 mt-3'>
                    <div className='grid grid-cols-2'>
                        <span>Von</span>
                        <ComboInput data={data} form={form} setForm={setForm} formfield={"from"} type={"depending"}></ComboInput>
                    </div>
                    <div className='grid grid-cols-2 mt-24'>
                        <span>An</span>
                        <ComboInput data={data} form={form} setForm={setForm} formfield={"to"} type={"depending"}></ComboInput>
                    </div>
                </div>
            </form>
            <div className='absolute flex bottom-24 left-1/2 -translate-x-1/2 justify-center'>
                <button onClick={submitForm} className='rounded-lg bg-slate-200 hover:bg-green-400 transition-colors py-2 px-20 '>
                    Speichern
                </button>
            </div>
        </div>
    )
}

export default NewTransaction