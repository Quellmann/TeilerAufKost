import { QrCodeIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import QRCodeModal from "../components/QRCodeModal";
import { API_BASE_URL } from "../config";
import JoinGroup from "./JoinGroup";
import Carousel from "../components/Carousel";
import GridLoader from "react-spinners/GridLoader";
import AddPage from "../components/AddPage";
import NewExpanditure from "../components/NewExpanditure";

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
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [personData, setPersonData] = useState([]);
  const [spendings, setSpendings] = useState([]);
  const [isOpenQR, setIsOpenQR] = useState(false);
  const [joined, setJoined] = useState(false);
  const [refresh, emblaRef, emblaApi] = useOutletContext();
  const [addType, setAddType] = useState("");
  const navigate = useNavigate();

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
      setSpendings(spending_data);
      setPersonData(
        data.groupMember.map((member) => new Person(member, spending_data))
      );
      setIsLoading(false);
      return Promise.resolve();
    } catch (error) {
      console.error("Fetch data error:", error);
      throw error;
    }
  }

  return joined ? (
    <div className={"relative h-full overflow-auto"}>
      <div
        className={`justify-center h-full items-center ${
          isLoading ? "flex" : "hidden"
        }`}
      >
        <GridLoader
          loading={isLoading}
          size={100}
          speedMultiplier={0.5}
          color="rgba(229 231 235)"
        ></GridLoader>
      </div>
      <div
        className={`flex flex-col 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] mx-auto transition-opacity duration-500 ease-in-out ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex flex-col grow">
          {!isLoading && (
            <div className="overflow-hidden my-5 pt-5 relative" ref={emblaRef}>
              <div className="flex gap-5">
                {/* outer carousel */}
                <div className="flex-none w-full min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl py-8 pl-3 truncate">
                      {data.groupName}
                    </div>
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
                  <Carousel
                    personData={personData}
                    spendings={spendings}
                  ></Carousel>
                </div>
                <div className="flex-none w-full min-w-0">
                  <AddPage
                    emblaApi={emblaApi}
                    setAddType={setAddType}
                  ></AddPage>
                </div>
                <div className="flex-none w-full min-w-0">
                  <NewExpanditure
                    addType={addType}
                    emblaApi={emblaApi}
                  ></NewExpanditure>
                </div>
              </div>
            </div>
          )}
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
