import React, { useState, useRef } from "react";
import { Input } from "@headlessui/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

const NewGroup = () => {
  const [memberInput, setMemberInput] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupMember, setGroupMember] = useState([]);
  const inputRef = useRef(null);
  const refresh = useOutletContext();
  const navigate = useNavigate();

  // Function to handle adding a member
  const handleAddMember = () => {
    if (memberInput) {
      setGroupMember((prevState) => [...prevState, memberInput]);
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
    }
  };

  const formValidation = () => {
    !groupName && toast.error("Gib einen Gruppenamen an");
    !groupMember.length > 0 && toast.error("Füge eine Person hinzu");

    return groupName && groupMember.length > 0;
  };

  const submitForm = async () => {
    if (formValidation()) {
      const response = await fetch(`${API_BASE_URL}/newGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupName: groupName,
          groupMember: groupMember,
        }),
      });
      const group = await response.json();
      refresh.current = new Date();
      navigate(`/?groupId=${group._id}`);
    }
  };

  return (
    <form
      className="pt-10 flex flex-col grow justify-between"
      autoComplete="off"
    >
      <div>
        <div className="text-xl mb-8 pl-3">Neue Gruppe hinzufügen</div>
        <div className="text-lg">
          <Input
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Name"
            className="border w-full rounded-lg p-2 text-center"
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
            className="border w-full rounded-lg p-2 h-10 text-center"
            name="group_member"
            type="text"
          />
          <div
            onClick={handleAddMember}
            className="absolute cursor-pointer border-l rounded-lg py-2 px-8 right-0 top-0 h-10 hover:bg-slate-200 hover:outline outline-2 -outline-offset-[3px] outline-black "
          >
            <UserPlusIcon className="size-6" />
          </div>
        </div>
        {groupMember.length > 0 && (
          <div className="grid grid-cols-1 my-5 border rounded-lg divide-y mx-auto">
            {groupMember.map((member, index) => (
              <div key={index} className="py-1 grid grid-cols-3">
                <div className="pl-2 ">{index + 1 + "."}</div>
                <div className="w-28">{member}</div>
                <div
                  className="justify-self-end mr-2 cursor-pointer hover:bg-slate-200 rounded-full"
                  onClick={() =>
                    setGroupMember(
                      groupMember.filter((person, idx) => idx != index)
                    )
                  }
                >
                  <XMarkIcon className="size-6"></XMarkIcon>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center mb-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            submitForm();
          }}
          className="rounded-lg bg-slate-200 hover:bg-green-400 transition-colors py-2 px-20"
        >
          Speichern
        </button>
      </div>
    </form>
  );
};

export default NewGroup;
