import { QrCodeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import QRCodeModal from "../components/QRCodeModal";
import { API_BASE_URL } from "../config";
import JoinGroup from "./JoinGroup";
import Carousel from "../components/Carousel";
import SkeletonOverview from "../components/SkeletonOverview";
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

class Household {
  constructor(householdIndex, memberNames, spendings) {
    this.name = `Haushalt ${householdIndex}: ${memberNames.join(", ")}`;
    this.memberNames = memberNames;
    this.spendings = spendings;
    this.balance = () => {
      let liabilities = 0;
      let expenditures = 0;

      spendings.forEach((item) => {
        // Calculate liabilities (amounts owed by this household)
        item.to.forEach((recipient) => {
          if (memberNames.includes(recipient.name)) {
            liabilities -= recipient.amount;
          }
        });

        // Calculate expenditures (amounts paid by this household)
        if (memberNames.includes(item.from)) {
          expenditures += item.to.reduce((a, b) => a + b.amount, 0);
        }
      });

      return +(liabilities + expenditures).toFixed(2);
    };
  }
}

const Overview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [personData, setPersonData] = useState([]);
  const [householdData, setHouseholdData] = useState([]);
  const [spendings, setSpendings] = useState([]);
  const [isOpenQR, setIsOpenQR] = useState(false);
  const [joined, setJoined] = useState(false);
  const [groupId, setGroupId] = useState("");
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [setSidebarGroups, refresh] = useOutletContext();

  const householdHelper = (members, spendings) => {
    const householdMap = {};
    members.forEach((member) => {
      const h = member.household ?? 0;
      if (!(h in householdMap)) {
        householdMap[h] = [];
      }
      householdMap[h].push(member.name);
    });

    const households = Object.entries(householdMap).map(
      ([hid, names]) => new Household(hid, names, spendings)
    );
    setHouseholdData(households);
  };

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
      setHouseholdData(householdHelper(data.groupMember, spending_data));
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
      return <SkeletonOverview />;
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
        <div className="rounded-lg border border-light-border dark:border-dark-border">
          <div className="p-2 flex items-center justify-between bg-light-card dark:bg-dark-card rounded-t-lg border-b border-light-border dark:border-dark-border">
            <div className="text-3xl truncate py-1">{data.groupName}</div>
            <div className="flex">
              <div
                onClick={() => setIsOpenQR(true)}
                className="p-1 rounded-lg cursor-pointer"
              >
                <QrCodeIcon className="h-7 w-7"></QrCodeIcon>
              </div>
            </div>
          </div>
          <div className="text-lg ml-4 mt-2">Saldo</div>
          <div className="m-2 flex flex-col divide-y rounded-lg text-xl bg-light-card dark:bg-dark-card border divide-light-border dark:divide-dark-border border-light-border dark:border-dark-border">
            {(() => {
              const saldoHousehold = JSON.parse(
                localStorage.getItem("saldoHousehold") || "false"
              );
              const data = saldoHousehold ? householdData : personData;
              return data.map((item, index) => (
                <div key={index} className="flex justify-between p-2">
                  <div className="">{item.name}</div>
                  <div className="">
                    <div>{item.balance().toFixed(2)} €</div>
                  </div>
                </div>
              ));
            })()}
          </div>
          <div className="mt-5 pt-2 border-t border-light-border dark:border-dark-border">
            <Carousel
              personData={personData}
              spendings={spendings}
              groupMembers={data.groupMember}
            ></Carousel>
          </div>
          <QRCodeModal
            isOpenQR={isOpenQR}
            setIsOpenQR={setIsOpenQR}
            qrCodeUrl={window.location.href}
          ></QRCodeModal>
        </div>
      );
    }
  };

  return renderOverview();
};

export default Overview;
