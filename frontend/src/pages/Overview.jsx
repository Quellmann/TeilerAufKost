import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import QRCodeModal from '../components/QRCodeModal';
import SaldoCalc from '../components/SaldoCalc';
import { API_BASE_URL, BASE_URL } from "../config";
import JoinGroup from './JoinGroup';
import toast from 'react-hot-toast';

const Overview = () => {
  const [data, setData] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [isOpenQR, setIsOpenQR] = useState(false)
  const [joined, setJoined] = useState(false)
  const scrollRef = useRef(null);
  const startRef = useRef(null);
  const debounceScrollRef = useRef(null);
  const debounceUpdateRef = useRef(null);
  const refresh = useOutletContext();
  const navigate = useNavigate();

  const { groupId } = useParams();

  const checkJoined = () => {
    const subscribedGroups = JSON.parse(localStorage.getItem('groupSubscription'))
    if (subscribedGroups && subscribedGroups.includes(groupId)) {
      setJoined(true)
    }
  }

  const debounce = (func, time, ref) => {
    clearTimeout(ref.current)
    ref.current = setTimeout(() => { func() }, time, ref)
  }

  const handleScroll = () => {
    if (scrollRef.current.scrollTop < 338) {
      if (scrollRef.current.scrollTop === 0) {
        debounce(() => toast.promise(fetchData(), { loading: "Refreshing", success: "Updated", error: "Error, something went wrong" }), 500, debounceUpdateRef)
      }
      debounce(() => startRef.current.scrollIntoView({ behavior: "smooth" }), 200, debounceScrollRef)
    }
    if (scrollRef.current.scrollTop + startRef.current.clientHeight > scrollRef.current.scrollHeight - 338) {
      if (scrollRef.current.scrollTop + scrollRef.current.clientHeight == scrollRef.current.scrollHeight) {
        setIsOpenQR(true);
      }
      debounce(() => startRef.current.scrollIntoView({ behavior: "smooth" }), 200, debounceScrollRef)
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [joined, scrollRef.current]);

  useEffect(() => {
    checkJoined()
    groupId && fetchData()
    if (joined) {
      startRef.current.scrollIntoView({ behavior: "instant" })
    }
    return;
  }, [joined, groupId, refresh.current]);

  async function fetchData() {
    try {
      const groupResponse = await fetch(`${API_BASE_URL}/${groupId}`);
      const spendingResponse = await fetch(`${API_BASE_URL}/${groupId}/spendings`);

      if (!groupResponse.ok || !spendingResponse.ok) {
        const message = `An error has occurred: ${groupResponse.statusText || spendingResponse.statusText}`;
        console.error(message);
        navigate("/not-found"); // Redirect the user
        throw new Error(message); // Throw an error so that the toast catches it
      }

      const data = await groupResponse.json();
      const spending_data = await spendingResponse.json();

      if (!data || !spending_data) {
        const message = "Data not found";
        console.warn(message);
        navigate("/not-found");
        throw new Error(message); // Throw an error if data is missing
      }

      setData(data); // Update the state with the fetched data
      setSpendingData(spending_data); // Update spending data
      return Promise.resolve(); // Resolve the promise to indicate success
    } catch (error) {
      console.error("Fetch data error:", error);
      throw error; // Re-throw the error so that toast.promise catches it and shows the error message
    }
  }

  return (
    joined ?
      <div ref={scrollRef} className='flex-1 h-full overflow-auto scroll-smooth'>
        <div className='2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] mx-auto'>
          <div className='flex justify-center'>
            <div className='flex flex-col items-center'>
              <div className='p-2 border rounded-lg my-20'>
                <ArrowPathIcon className='h-7 w-7'></ArrowPathIcon>
              </div>
              <div className='mb-10 mt-20'>
                <ChevronUpIcon className='size-7'></ChevronUpIcon>
              </div>
            </div>
          </div>
          <div ref={startRef} className="snap-center snap-always scroll-my-4 h-screen">
            <div className='text-xl py-8 pl-3 truncate'>
              {data.groupName}
            </div>
            <div className='text-lg pl-3'>
              Saldo
            </div>
            <div className='flex flex-col divide-y rounded-lg border mr-2'>
              {data.groupMember?.map((member, index) => (
                <div key={index} className='flex justify-between p-3'>
                  <div className='font-thin'>{member}</div>
                  <div className='font-thin'><SaldoCalc name={member} spendings={spendingData}></SaldoCalc></div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex justify-center'>
            <div className='flex flex-col items-center'>
              <div className='mb-10 mt-20'>
                <ChevronDownIcon className='size-7' />
              </div>
              <div className='p-2 border rounded-lg my-20'>
                <QrCodeIcon className='h-7 w-7'></QrCodeIcon>
              </div>
            </div>
          </div>
          <QRCodeModal isOpenQR={isOpenQR} setIsOpenQR={setIsOpenQR} qrCodeUrl={`${BASE_URL}/${groupId}`}></QRCodeModal>
        </div>
      </div>
      :
      <JoinGroup groupName={data.groupName} groupId={groupId} setJoined={setJoined} refresh={refresh}></JoinGroup>
  )
}

export default Overview