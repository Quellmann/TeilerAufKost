import { QrCodeIcon } from "@heroicons/react/24/outline";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import QRCodeModal from "../components/QRCodeModal";
import { API_BASE_URL } from "../config";
import JoinGroup from "./JoinGroup";
import useEmblaCarousel from "embla-carousel-react";
import toast from "react-hot-toast";
import Balancing from "../components/Balancing";
import Summary from "../components/Summary";
import Statistics from "../components/Statistics";
import Carousel from "../components/Carousel";

class Person {
  constructor(name, spendings) {
    this.name = name;
    this.liabilities = spendings.map((item) => {
      const person = item.to.find((person) => person.name === name);
      return person ? -person.amount : 0;
    });
    this.expenditures = spendings.map((item) => {
      return item.from === name ? item.amount : 0;
    });
    this.balance = () => {
      return (
        this.liabilities.reduce((a, b) => a + b, 0) +
        this.expenditures.reduce((a, b) => a + b, 0)
      );
    };
  }
}

const Overview = () => {
  const [data, setData] = useState([]);
  const [personData, setPersonData] = useState([]);
  const [isOpenQR, setIsOpenQR] = useState(false);
  const [joined, setJoined] = useState(false);
  const refresh = useOutletContext();
  const navigate = useNavigate();
  const [emblaRef] = useEmblaCarousel();

  const { groupId } = useParams();

  const checkJoined = () => {
    const subscribedGroups = JSON.parse(
      localStorage.getItem("groupSubscription")
    );
    if (subscribedGroups && subscribedGroups.includes(groupId)) {
      setJoined(true);
    }
  };

  useEffect(() => {
    checkJoined();
    groupId && fetchData();
    return;
  }, [joined, groupId, refresh.current]);

  async function fetchData() {
    try {
      const groupResponse = await fetch(`${API_BASE_URL}/${groupId}`);
      const spendingResponse = await fetch(
        `${API_BASE_URL}/${groupId}/spendings`
      );

      if (!groupResponse.ok || !spendingResponse.ok) {
        const message = `An error has occurred: ${
          groupResponse.statusText || spendingResponse.statusText
        }`;
        console.error(message);
        navigate("/not-found");
        throw new Error(message);
      }

      const data = await groupResponse.json();
      const spending_data = await spendingResponse.json();

      if (!data || !spending_data) {
        const message = "Data not found";
        console.warn(message);
        navigate("/not-found");
        throw new Error(message);
      }

      setData(data);
      setPersonData(
        data.groupMember.map((member) => new Person(member, spending_data))
      );
      return Promise.resolve();
    } catch (error) {
      console.error("Fetch data error:", error);
      throw error;
    }
  }

  return joined ? (
    <div className="h-full overflow-auto">
      <div className="flex flex-col 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] mx-auto">
        <div className="flex flex-col grow">
          <div className="flex items-center justify-between">
            <div className="text-3xl py-8 pl-3 truncate">{data.groupName}</div>
            <div className="flex">
              <div
                onClick={() => setIsOpenQR(true)}
                className="p-2 border rounded-lg cursor-pointer"
              >
                <QrCodeIcon className="h-7 w-7"></QrCodeIcon>
              </div>
            </div>
          </div>
          <div className="text-lg p-3">Saldo</div>
          <div className="flex flex-col divide-y rounded-lg border text-xl">
            {data.groupMember?.map((member, index) => (
              <div key={index} className="flex justify-between p-3">
                <div className="">{member}</div>
                <div className="">
                  <div>
                    {personData
                      .find((person) => person.name === member)
                      .balance()
                      .toFixed(2)}{" "}
                    €
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <TabGroup defaultIndex={1} className="my-10 pt-5 border-t">
            <TabList className="flex pb-5 overflow-x-auto gap-5 snap-x scroll-smooth">
              <Tab className="data-[selected]:bg-slate-300 px-3 py-1 rounded-full border w-1/3 hover:bg-slate-100 snap-center min-w-[70%] sm:min-w-[33%]">
                Ausgleichszahlungen
              </Tab>
              <Tab className="data-[selected]:bg-slate-300 px-3 py-1 rounded-full border w-1/3 hover:bg-slate-100 snap-center min-w-[70%] sm:min-w-[33%]">
                Zusammenfassung
              </Tab>
              <Tab className="data-[selected]:bg-slate-300 px-3 py-1 rounded-full border w-1/3 hover:bg-slate-100 snap-center min-w-[70%] sm:min-w-[33%]">
                Statistik
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Balancing personData={personData}></Balancing>
              </TabPanel>
              <TabPanel>
                <Summary personData={personData}></Summary>
              </TabPanel>
              <TabPanel>
                <Statistics personData={personData}></Statistics>
              </TabPanel>
            </TabPanels>
          </TabGroup> */}
          <Carousel personData={personData}></Carousel>
        </div>
      </div>
      <QRCodeModal
        isOpenQR={isOpenQR}
        setIsOpenQR={setIsOpenQR}
        qrCodeUrl={window.location.href}
      ></QRCodeModal>
    </div>
  ) : (
    <JoinGroup
      groupName={data.groupName}
      groupId={groupId}
      setJoined={setJoined}
      refresh={refresh}
    ></JoinGroup>
  );
};

export default Overview;
