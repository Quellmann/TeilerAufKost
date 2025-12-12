import { useState, useRef } from "react";
import { Input } from "@headlessui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";
import SkeletonOverview from "../components/SkeletonOverview";

const NewGroup = () => {
  const [memberInput, setMemberInput] = useState("");
  const [data, setData] = useState({ groupName: "", groupMember: [] });
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle adding a member
  const handleAddMember = () => {
    if (memberInput) {
      setData((prev) => ({
        ...prev,
        groupMember: [
          ...prev.groupMember,
          { name: memberInput, household: prev.groupMember.length },
        ],
      }));
      setMemberInput("");
    } else {
      toast.error("Ungültiger Name");
    }
    // Focus the input field after the button click
    inputRef.current.focus();
  };

  // Handle the key down event for the Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddMember();
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleHouseholdClick = (type, member) => {
    if (
      type === "decrease" &&
      data.groupMember.find((elmt) => elmt.name === member.name).household -
        1 >=
        0
    ) {
      setData((prev) => ({
        ...prev,
        groupMember: prev.groupMember.map((elmt) =>
          elmt.name === member.name
            ? { name: elmt.name, household: elmt.household - 1 }
            : elmt
        ),
      }));
    } else if (
      type === "increase" &&
      data.groupMember.find((elmt) => elmt.name === member.name).household + 1 <
        data.groupMember.length
    ) {
      setData((prev) => ({
        ...prev,
        groupMember: prev.groupMember.map((elmt) =>
          elmt.name === member.name
            ? { name: elmt.name, household: elmt.household + 1 }
            : elmt
        ),
      }));
    }
  };

  const handleDelete = (id) => {
    setData((prev) => ({
      ...prev,
      groupMember: prev.groupMember.filter((elmt, index) => index != id),
    }));
  };

  const formValidation = () => {
    !data.groupMember.length > 0 && toast.error("Füge eine Person hinzu");

    return data.groupMember.length > 0;
  };

  const submitForm = async () => {
    if (!formValidation() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/newGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Request failed");
      }
      const group = await response.json();
      navigate(`/?groupId=${group._id}`, { replace: true });
    } catch (err) {
      toast.error("Fehler beim Erstellen der Gruppe");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="p-4">
        <SkeletonOverview />
      </div>
    );
  }

  return (
    <form
      className="my-6 p-2 flex flex-col grow rounded-lg border border-light-border dark:border-dark-border"
      autoComplete="off"
    >
      <div className="flex flex-col grow">
        <div className="text-3xl mb-8 mt-2">Neue Gruppe hinzufügen</div>
        <div className="text-lg mt-10 relative">
          <Input
            value={data.groupName}
            onChange={(e) =>
              setData((prev) => ({ ...prev, groupName: e.target.value }))
            }
            placeholder="Gruppenname"
            className="w-full rounded-lg p-2 h-10 text-center border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card"
            name="group_name"
            type="text"
          />
        </div>
        <div className="text-lg mt-10 relative">
          <Input
            ref={inputRef}
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Personen"
            className="w-full rounded-lg p-2 h-10 text-center border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card"
            name="group_member"
            type="text"
          />
          <div
            onClick={handleAddMember}
            className="absolute cursor-pointer rounded-lg py-2 px-8 right-0 top-0 h-10 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card"
          >
            <UserPlusIcon className="size-6" />
          </div>
        </div>
        <div className="grid grid-cols-1 my-5 rounded-lg divide-y divide-light-border dark:divide-dark-border border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
          {/* tablehead */}
          <div className="py-1 grid grid-cols-4 font-bold">
            <div className="pl-2">Nummer</div>
            <div>Name</div>
            <div>Haushalt</div>
            <div className="text-right mr-2">Löschen</div>
          </div>
          {/* tablerows */}
          {data.groupMember?.map((member, index) => (
            <div key={index} className="py-1 grid grid-cols-4">
              <div className="pl-2">{index + 1 + "."}</div>
              <div className="w-28">{member.name}</div>
              {/* household selector */}
              <div className="flex items-center select-none">
                <div
                  onClick={() => handleHouseholdClick("decrease", member)}
                  className="p-0.5 cursor-pointer"
                >
                  <ChevronLeftIcon className="size-5"></ChevronLeftIcon>
                </div>
                <div className="px-1">{member.household}</div>
                <div
                  onClick={() => handleHouseholdClick("increase", member)}
                  className="p-0.5 cursor-pointer"
                >
                  <ChevronRightIcon className="size-5"></ChevronRightIcon>
                </div>
              </div>
              <div
                className="justify-self-end mr-2 cursor-pointer"
                onClick={() => handleDelete(index)}
              >
                <XMarkIcon className={`size-6`}></XMarkIcon>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mb-10">
        <button
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            if (!isSubmitting) submitForm();
          }}
          className={`rounded-lg transition-colors py-2 px-20 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Speichern..." : "Speichern"}
        </button>
      </div>
    </form>
  );
};

export default NewGroup;
