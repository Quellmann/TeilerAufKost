import {
  ArrowLeftStartOnRectangleIcon,
  ArrowPathIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

import { useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { API_BASE_URL } from "../config";
import DeleteModal from "./DeleteModal";

const Options = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [saldoHousehold, setSaldoHousehold] = useState(() =>
    JSON.parse(localStorage.getItem("saldoHousehold") || "false")
  );
  const [setSidebarGroups, refresh, emblaApi, setRefresh] = useOutletContext();

  const deleteGroupSubscription = () => {
    const subscribedGroups = JSON.parse(
      localStorage.getItem("groupSubscription")
    );
    localStorage.setItem(
      "groupSubscription",
      JSON.stringify(
        subscribedGroups.filter(
          (group) => group.id != searchParams.get("groupId")
        )
      )
    );
    setSidebarGroups((prev) =>
      prev.filter((group) => group.id != searchParams.get("groupId"))
    );
    navigate("/");
  };

  const deleteGroupSpendings = async () => {
    const response = await fetch(
      `${API_BASE_URL}/${searchParams.get("groupId")}/deleteGroupSpendings`,
      {
        method: "DELETE",
      }
    );
    setRefresh(new Date());
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between gap-2">
        <div
          onClick={() => {
            setSaldoHousehold(false);
            localStorage.setItem("saldoHousehold", JSON.stringify(false));
            setRefresh(new Date());
          }}
          className="flex p-3 grow justify-around items-center rounded-lg cursor-pointer text-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
        >
          <div
            className={`w-4 h-4 mr-2 min-w-4 ring-2 ring-inset ring-light-text dark:ring-dark-text rounded-full transition-all duration-300 ${
              saldoHousehold === false
                ? "bg-light-text dark:bg-dark-text"
                : "bg-light-bg dark:bg-dark-card"
            }`}
          ></div>
          <div className="select-none">Saldo pro Mitglied</div>
        </div>
        <div
          onClick={() => {
            setSaldoHousehold(true);
            // localStorage.setItem("saldoHousehold", JSON.stringify(true));
            // setRefresh(new Date());
            console.log("not supported yet");
          }}
          className="flex p-3 grow justify-around items-center rounded-lg cursor-pointer text-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
        >
          <div
            className={`w-4 h-4 mr-2 min-w-4 ring-2 ring-inset ring-light-text dark:ring-dark-text rounded-full transition-all duration-300 ${
              saldoHousehold === true
                ? "bg-light-text dark:bg-dark-text"
                : "bg-light-bg dark:bg-dark-card"
            }`}
          ></div>
          <div className="select-none">Saldo pro Haushalt</div>
        </div>
      </div>
      <div
        onClick={() => {
          emblaApi.scrollTo(2);
          setSearchParams({
            groupId: searchParams.get("groupId"),
            type: "person",
          });
        }}
        className="flex p-3 justify-center items-center rounded-lg cursor-pointer text-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
      >
        <UserPlusIcon className="size-6 mr-3"></UserPlusIcon>
        Mitglieder verwalten
      </div>
      <div
        onClick={() => setIsOpen(true)}
        className="flex p-3 justify-center items-center rounded-lg cursor-pointer text-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
      >
        <ArrowPathIcon className="size-6 mr-3"></ArrowPathIcon>
        Ausgaben zurücksetzen
      </div>
      <div
        onClick={() => deleteGroupSubscription()}
        className="flex p-3 justify-center items-center rounded-lg cursor-pointer text-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
      >
        <ArrowLeftStartOnRectangleIcon className="size-6 mr-3"></ArrowLeftStartOnRectangleIcon>
        Gruppe verlassen
      </div>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        text={"Bitte bestätige, dass du alle Ausgaben löschen willst."}
        callback={() => deleteGroupSpendings()}
      ></DeleteModal>
    </div>
  );
};

export default Options;
