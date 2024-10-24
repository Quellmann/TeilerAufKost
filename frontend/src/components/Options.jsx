import {
  ArrowLeftStartOnRectangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

const Options = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [setSidebarGroups] = useOutletContext();

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
  return (
    <div className="flex flex-col gap-5">
      <div className="flex p-3 justify-center items-center border rounded-lg hover:bg-yellow-400 cursor-pointer text-xl">
        <ArrowPathIcon className="size-6 mr-3"></ArrowPathIcon>
        Ausgaben zurücksetzen
      </div>
      <div
        onClick={() => deleteGroupSubscription()}
        className="flex p-3 justify-center items-center border rounded-lg hover:bg-red-400 cursor-pointer text-xl"
      >
        {/* <TrashIcon className="size-6 mr-3"></TrashIcon> */}
        <ArrowLeftStartOnRectangleIcon className="size-6 mr-3"></ArrowLeftStartOnRectangleIcon>
        Gruppe verlassen
      </div>
    </div>
  );
};

export default Options;
