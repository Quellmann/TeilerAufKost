import React from "react";
import { Link, useOutletContext } from "react-router-dom";

const JoinGroup = ({ groupName, groupId, setJoined }) => {
  const [setSidebarGroups] = useOutletContext();

  const saveGroupSubscription = () => {
    // Get the existing subscriptions from localStorage
    const subscribedGroups = JSON.parse(
      localStorage.getItem("groupSubscription")
    );

    // Create a new group object with both id and name
    const newGroup = { id: groupId, name: groupName };

    // If there are no subscriptions yet, save the first group
    if (!subscribedGroups) {
      localStorage.setItem("groupSubscription", JSON.stringify([newGroup]));
      setJoined(true);
    } else {
      // Check if the group is already subscribed by matching groupId
      const isAlreadySubscribed = subscribedGroups.some(
        (group) => group.id === groupId
      );

      // If the group is not subscribed, add it to the list
      if (!isAlreadySubscribed) {
        localStorage.setItem(
          "groupSubscription",
          JSON.stringify([...subscribedGroups, newGroup])
        );
        setSidebarGroups((prev) => [...prev, newGroup]);
        setJoined(true);
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex flex-col items-center text-xl mt-40 grow">
        <div>Möchtest du der Gruppe</div>
        <div className="text-3xl">{groupName}</div>
        <div className="mb-10">beitreten?</div>
        <button
          onClick={() => saveGroupSubscription()}
          className="py-2 px-10 bg-slate-200 rounded-lg hover:bg-green-500 transition-colors"
        >
          Beitreten
        </button>
      </div>
      <div className="flex justify-center mb-10">
        <Link
          to={"/"}
          className="rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors py-2 px-20"
        >
          Zurück
        </Link>
      </div>
    </div>
  );
};

export default JoinGroup;
