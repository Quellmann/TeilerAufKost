import { useState, useEffect, useRef } from "react";
import SkeletonForm from "../components/SkeletonForm";
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

const NewPerson = ({ emblaApi, setRefresh }) => {
  const [memberInput, setMemberInput] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [spendings, setSpendings] = useState([]);
  const [personData, setPersonData] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");

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
    if (
      personData.find((elmt) => elmt.name === data.groupMember[id].name) &&
      personData[id].balance()
    ) {
      toast.dismiss();
      toast.error(
        "Begleiche zuerst die Schulden dieser Person, bevor du sie löschst."
      );
    } else {
      setPersonData((prev) =>
        prev.filter((elmt) => elmt.name != data.groupMember[id].name)
      );
      setData((prev) => ({
        ...prev,
        groupMember: prev.groupMember.filter((elmt, index) => index != id),
      }));
    }
  };

  const formValidation = () => {
    !data.groupMember.length > 0 && toast.error("Füge eine Person hinzu");

    return data.groupMember.length > 0;
  };

  const submitForm = async () => {
    if (formValidation()) {
      emblaApi.scrollTo(1);
      const response = await fetch(`${API_BASE_URL}/${groupId}/updateGroup`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
      });
      const group = await response.json();
      setRefresh(new Date());
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
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
    }
    fetchData();
    return;
  }, []);

  if (isLoading) {
    return (
      <div className="p-4">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <form className="flex flex-col grow" autoComplete="off">
      <div className="flex flex-col grow">
        <div className="text-3xl mb-8">Mitglieder bearbeiten</div>
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
            className="absolute cursor-pointer border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card rounded-lg py-2 px-8 right-0 top-0 h-10"
          >
            <UserPlusIcon className="size-6" />
          </div>
        </div>
        <div className="grid grid-cols-1 my-5 rounded-lg divide-y dark:divide-dark-border border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
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
                  className="p-0.5 cursor-pointer hover:bg-slate-200 rounded-full"
                >
                  <ChevronLeftIcon className="size-5"></ChevronLeftIcon>
                </div>
                <div className="px-1">{member.household}</div>
                <div
                  onClick={() => handleHouseholdClick("increase", member)}
                  className="p-0.5 cursor-pointer hover:bg-slate-200 rounded-full"
                >
                  <ChevronRightIcon className="size-5"></ChevronRightIcon>
                </div>
              </div>
              <div
                className="justify-self-end mr-2 cursor-pointer hover:bg-slate-200 rounded-full"
                onClick={() => handleDelete(index)}
              >
                <XMarkIcon
                  className={`size-6 ${personData[index]?.balance() && ""}`}
                ></XMarkIcon>
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
          className="rounded-lg py-2 px-20 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card"
        >
          Speichern
        </button>
      </div>
    </form>
  );
};

export default NewPerson;
