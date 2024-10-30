import {
  ArrowLeftStartOnRectangleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

import React, { useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { API_BASE_URL } from "../config";
import AcceptModal from "./AcceptModal";

const Options = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
    <div className="flex flex-col gap-5 m-0.5">
      <div
        onClick={() => {
          emblaApi.scrollTo(2);
          setSearchParams({
            groupId: searchParams.get("groupId"),
            type: "person",
          });
        }}
        className="flex p-3 justify-center items-center border rounded-lg hover:bg-slate-300 cursor-pointer text-xl"
      >
        <UserPlusIcon className="size-6 mr-3"></UserPlusIcon>
        Person hinzufügen
      </div>
      <div
        onClick={() => setIsOpen(true)}
        className="flex p-3 justify-center items-center border rounded-lg hover:bg-yellow-400 cursor-pointer text-xl"
      >
        <ArrowPathIcon className="size-6 mr-3"></ArrowPathIcon>
        Ausgaben zurücksetzen
      </div>
      <div
        onClick={() => deleteGroupSubscription()}
        className="flex p-3 justify-center items-center border rounded-lg hover:bg-red-400 cursor-pointer text-xl"
      >
        <ArrowLeftStartOnRectangleIcon className="size-6 mr-3"></ArrowLeftStartOnRectangleIcon>
        Gruppe verlassen
      </div>
      <AcceptModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalData={{
          title: "Ausgaben löschen",
          text1: "Bist du sicher, dass du alle Ausgaben löschen willst?",
          text2: "Du kannst diese Aktion nicht rückgängig machen.",
          button: "Löschen",
        }}
        callback={() => deleteGroupSpendings()}
      ></AcceptModal>
    </div>
  );
};

export default Options;
