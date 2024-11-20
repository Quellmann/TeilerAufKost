import { QrCodeIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import QRCodeModal from "../components/QRCodeModal";
import { API_BASE_URL } from "../config";
import JoinGroup from "./JoinGroup";
import Carousel from "../components/Carousel";
import GridLoader from "react-spinners/GridLoader";
import LandingPage from "./LandingPage";

class Person {
  constructor(name, spendings) {
    this.name = name;
    this.liabilities = spendings.map((item) => {
      const person = item.to.find((person) => person.name === name);
      return person ? -person.amount : 0;
    });
    this.expenditures = spendings.map((item) => {
      // calculate exact expanditure with rounding to 2 decimal cent values
      return item.from === name ? item.to.reduce((a, b) => a + b.amount, 0) : 0;
    });
    this.balance = () => {
      return +(
        this.liabilities.reduce((a, b) => a + b, 0) +
        this.expenditures.reduce((a, b) => a + b, 0)
      ).toFixed(2);
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
  const [groupId, setGroupId] = useState("");
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [setSidebarGroups, refresh] = useOutletContext();

  const checkJoined = () => {
    const subscribedGroups = JSON.parse(
      localStorage.getItem("groupSubscription")
    );
    if (subscribedGroups) {
      const isAlreadySubscribed = subscribedGroups.some(
        (group) => group.id === groupId
      );
      if (subscribedGroups && isAlreadySubscribed) {
        setJoined(true);
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (searchParams.get("groupId") != groupId) {
      setIsLoading(true);
    }
    setGroupId(searchParams.get("groupId"));
    return;
  }, [searchParams]);

  useEffect(() => {
    groupId && fetchData();
    checkJoined();
    return;
  }, [groupId, refresh]);

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
        data.groupMember.map((member) => new Person(member.name, spending_data))
      );
      setIsLoading(false);
      return Promise.resolve();
    } catch (error) {
      console.error("Fetch data error:", error);
      throw error;
    }
  }

  const renderOverview = () => {
    if (!groupId) {
      return <LandingPage></LandingPage>;
    } else if (isLoading) {
      return (
        <div className="flex justify-center h-full items-center">
          <GridLoader
            loading={isLoading}
            size={100}
            speedMultiplier={0.5}
            color="rgba(229 231 235)"
          ></GridLoader>
        </div>
      );
    } else if (!joined) {
      return (
        <JoinGroup
          groupName={data.groupName}
          groupId={groupId}
          setJoined={setJoined}
        ></JoinGroup>
      );
    } else {
      return (
        <>
          <div>
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
                  <div className="">{member.name}</div>
                  <div className="">
                    <div>
                      {personData
                        .find((person) => person.name === member.name)
                        .balance()
                        .toFixed(2)}{" "}
                      €
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Carousel personData={personData} spendings={spendings}></Carousel>
          </div>
          <QRCodeModal
            isOpenQR={isOpenQR}
            setIsOpenQR={setIsOpenQR}
            qrCodeUrl={window.location.href}
          ></QRCodeModal>
        </>
      );
    }
  };

  return renderOverview();
};

export default Overview;
