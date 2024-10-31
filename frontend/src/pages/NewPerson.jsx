import React, { useState, useEffect, useRef } from "react";
import { Input } from "@headlessui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

const NewPerson = ({ emblaApi, setRefresh }) => {
  const [memberInput, setMemberInput] = useState("");
  const [groupMember, setGroupMember] = useState([]);
  const [data, setData] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");

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
    !groupMember.length > 0 && toast.error("Füge eine Person hinzu");

    return groupMember.length > 0;
  };

  const submitForm = async () => {
    if (formValidation()) {
      emblaApi.scrollTo(1);
      const response = await fetch(`${API_BASE_URL}/${groupId}/updateGroup`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupMember: groupMember }),
      });
      const group = await response.json();
      setRefresh(new Date());
    }
  };

  useEffect(() => {
    async function fetchData() {
      const groupResponse = await fetch(`${API_BASE_URL}/${groupId}`);
      if (!groupResponse.ok) {
        const message = `An error has occurred: ${groupResponse.statusText}`;
        console.error(message);
        return;
      }
      const data = await groupResponse.json();
      if (!data) {
        console.warn(`Data not found`);
        navigate("/");
      }
      setData(data);
    }
    fetchData();
    return;
  }, []);

  return (
    <form className="flex flex-col grow" autoComplete="off">
      <div className="flex flex-col grow">
        <div className="text-3xl mb-8">Neue Person hinzufügen</div>
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
        <div className="grid grid-cols-1 my-5 border rounded-lg divide-y">
          {data.groupMember?.map((member, index) => (
            <div key={index} className="py-1 grid grid-cols-3">
              <div className="pl-2 ">{index + 1 + "."}</div>
              <div className="w-28">{member}</div>
            </div>
          ))}
          {groupMember.map((member, index) => (
            <div key={index} className="py-1 grid grid-cols-3">
              <div className="pl-2 ">
                {data.groupMember.length + index + 1 + "."}
              </div>
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

export default NewPerson;
