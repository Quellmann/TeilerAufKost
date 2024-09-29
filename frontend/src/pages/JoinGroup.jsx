import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const JoinGroup = ({ groupName, groupId, setJoined, refresh }) => {
    const navigate = useNavigate()

    function saveGroupSubscription() {
        const subscribedGroups = JSON.parse(localStorage.getItem('groupSubscription'))
        if (!subscribedGroups) {
            localStorage.setItem('groupSubscription', JSON.stringify([groupId]));
            refresh.current = new Date()
            setJoined(true)
        }
        else if (!subscribedGroups.includes(groupId)) {
            localStorage.setItem('groupSubscription', JSON.stringify([...subscribedGroups, groupId]));
            refresh.current = new Date()
            setJoined(true)
        }
    }

    return (
        <div className='flex-1 h-full overflow-auto scroll-smooth'>
            <div className='h-full 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] mx-auto justify-center flex'>
                <div className='flex flex-col items-center text-xl mt-40'>
                    <div>Möchtest du der Gruppe</div>
                    <div className='text-3xl'>{groupName}</div>
                    <div className='mb-10'>beitreten?</div>
                    <button onClick={() => saveGroupSubscription()} className='py-2 px-10 bg-slate-200 rounded-lg hover:bg-green-500 transition-colors'>Beitreten</button>
                </div>
                <div className='absolute flex bottom-24 left-1/2 -translate-x-1/2 justify-center'>
                    <Link to={"/"} className='rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors py-2 px-20'>
                        Zurück
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default JoinGroup