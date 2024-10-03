import React, { useState, useEffect } from "react";
import { Input } from "@headlessui/react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";
import clsx from "clsx";

const NewSpending = () => {
  const [data, setData] = useState([]);
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    from: "",
    to: [{ name: "", amount: 0 }],
    individualValueHistory: [],
  });

  const formValidation = () => {
    !form.title && toast.error("Gib einen gültigen Titel an");
    !form.amount && toast.error("Gib einen gültigen Betrag an");
    !form.from && toast.error("Wähle bitte einen Bezahlenden");
    !form.to.length > 0 && toast.error("Wähle bitte die Empfänger");

    return form.title && form.amount && form.from && form.to.length > 0;
  };

  const displayMultiplePeople = () => {
    if (form.to.length > 1) {
      return form.to.length + " Personen";
    }
    return form.to.map((elmt) => elmt.name);
  };

  const handleMultiplePersonSelection = (selectedPeople) => {
    const formToField = data.groupMember
      .filter((member) => selectedPeople.includes(member))
      .map((member) => ({ name: member, amount: 0 }));
    setForm((prev) => ({ ...prev, to: formToField }));
  };

  const individualValueHandler = (input, value, person) => {
    const convertedValue = +(input === "percent"
      ? ((form.amount * value) / 100).toFixed(2)
      : value);

    setForm((prev) => ({
      ...prev,
      individualValueHistory: [
        ...prev.individualValueHistory.filter((elmt) => elmt != person),
        person,
      ],
    }));

    setForm((prev) => ({
      ...prev,
      to: prev.to.map((elmt) =>
        elmt.name === person ? { ...elmt, amount: convertedValue } : elmt
      ),
    }));
  };

  const recalculateUneditedMembers = () => {
    const editedTotal = form.to
      .filter((member) => form.individualValueHistory.includes(member.name))
      .reduce((a, b) => a + b.amount, 0);
    const uneditedCount = form.to.length - form.individualValueHistory.length;

    const remainingAmount = form.amount - editedTotal;

    if (remainingAmount < 0) {
      setForm((prev) => ({
        ...prev,
        individualValueHistory: prev.individualValueHistory.slice(1),
      }));
    } else if (uneditedCount === 0) {
      const lastChange = form.individualValueHistory.at(-1);
      setForm((prev) => ({
        ...prev,
        to: prev.to.map((member) =>
          lastChange == member.name
            ? { ...member, amount: member.amount + parseFloat(remainingAmount) }
            : member
        ),
      }));
    } else {
      let newSplit = parseFloat((remainingAmount / uneditedCount).toFixed(2));
      const notSplittable =
        form.amount - editedTotal - newSplit * uneditedCount;
      if (notSplittable > 0.001) {
        newSplit += 0.01;
      }

      setForm((prev) => ({
        ...prev,
        to: prev.to.map((member) =>
          form.individualValueHistory.includes(member.name)
            ? member
            : { ...member, amount: parseFloat(newSplit.toFixed(2)) }
        ),
      }));
    }
  };

  useEffect(() => {
    recalculateUneditedMembers();
  }, [form.individualValueHistory, form.amount]);

  useEffect(() => {
    if (form.to.length > 0) {
      setForm((prev) => ({ ...prev, individualValueHistory: [] }));
      setForm((prev) => ({
        ...prev,
        to: prev.to.map((member) => ({
          ...member,
          amount: (form.amount / form.to.length).toFixed(2),
        })),
      }));
    }
  }, [form.to.length, form.amount]);

  const handleAmountInput = (e) => {
    let value = e.target.value;

    if (value.includes(".")) {
      const parts = value.split(".");
      value = parts[0] + "." + parts[1].slice(0, 2);
    }
    setForm((prevState) => ({ ...prevState, amount: value }));
  };

  const submitForm = async () => {
    if (formValidation()) {
      const response = await fetch(`${API_BASE_URL}/${groupId}/newSpending`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const group = await response.json();
      navigate("/" + group.groupId);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${API_BASE_URL}/${groupId}`);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const data = await response.json();
      if (!data) {
        console.warn(`Data not found`);
        navigate("/");
      }
      setData(data);
      setForm((prevState) => ({
        ...prevState,
        to: data.groupMember?.map((member) => ({ name: member, amount: 0 })),
      }));
    }
    groupId && fetchData();
    return;
  }, [groupId]);

  return (
    <div className="flex-1 overflow-y-auto mt-16 mb-16 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] mx-auto">
      <form className="mt-10 flex flex-col" autoComplete="off">
        <div className="text-xl mb-8 pl-3">Neue Ausgabe hinzufügen</div>
        <div className="text-lg pl-3">
          <Input
            onChange={(e) =>
              setForm((prevState) => ({ ...prevState, title: e.target.value }))
            }
            placeholder="Titel"
            className="border w-full rounded-lg p-2 text-center"
            name="spending_title"
            type="text"
          />
        </div>
        <div className="text-lg pl-3 mt-3">
          <Input
            onChange={(e) => handleAmountInput(e)}
            value={form.amount}
            placeholder="Betrag"
            className="border w-full rounded-lg py-2 text-center"
            name="spending_amount"
            type="number"
            step="0.01"
            min="0"
          />
        </div>
        <div className="text-lg pl-3 mt-3">
          <div className="grid grid-cols-2">
            <span>Von</span>
            <Listbox
              value={form.from}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, from: value }))
              }
            >
              <ListboxButton
                className={clsx(
                  "relative block w-full rounded-lg border bg-slate-100 py-1.5 pr-8 pl-3 text-left text-sm/6 text-black min-h-10",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                )}
              >
                {form.from}
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black/60"
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions
                anchor="bottom"
                transition
                className={clsx(
                  "w-[var(--button-width)] rounded-xl border border-slate-200 bg-slate-100 p-1 mt-1 [--anchor-gap:var(--spacing-1)] focus:outline-none",
                  "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                )}
              >
                {data.groupMember?.map((person, index) => (
                  <ListboxOption
                    key={index}
                    value={person}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10"
                  >
                    <CheckIcon className="invisible size-4 fill-black group-data-[selected]:visible" />
                    <div className="text-sm/6 text-black">{person}</div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </div>
          <div className="grid grid-cols-2 mt-24">
            <span>An</span>
            <Listbox
              value={form.to?.map((elmt) => elmt.name)}
              onChange={(selectedPeople) =>
                handleMultiplePersonSelection(selectedPeople)
              }
              multiple
            >
              <ListboxButton
                className={clsx(
                  "relative block w-full rounded-lg border bg-slate-100 py-1.5 pr-8 pl-3 text-left text-sm/6 text-black min-h-10",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                )}
              >
                {displayMultiplePeople()}
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black/60"
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions
                anchor="bottom"
                transition
                className={clsx(
                  "w-[var(--button-width)] rounded-xl border border-slate-200 bg-slate-100 p-1 mt-1 [--anchor-gap:var(--spacing-1)] focus:outline-none",
                  "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                )}
              >
                {data.groupMember?.map((person, index) => (
                  <ListboxOption
                    key={index}
                    value={person}
                    className="group flex h-[38px] cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10"
                  >
                    <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
                    <div className="text-sm/6 text-black flex-1 truncate">
                      {person}
                    </div>
                    {form.to?.map(
                      (elmt, j) =>
                        elmt.name === person && (
                          <div key={j} className="flex grow justify-around">
                            <div className="flex items-center">
                              <Input
                                autoComplete="off"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  individualValueHandler(
                                    "amount",
                                    e.target.value,
                                    person
                                  )
                                }
                                value={elmt.amount}
                                className="border w-16 rounded-lg text-right"
                                name={"amount" + person}
                                type="number"
                                step="0.01"
                                min="0"
                              />
                              <div>€</div>
                            </div>
                            <div className="flex items-center">
                              <Input
                                autoComplete="off"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  individualValueHandler(
                                    "percent",
                                    e.target.value,
                                    person
                                  )
                                }
                                value={
                                  elmt.amount != 0 || form.amount != 0
                                    ? (
                                        (elmt.amount / form.amount) *
                                        100
                                      ).toFixed(2)
                                    : 0
                                }
                                className="border w-16 rounded-lg text-right"
                                name={"percent" + person}
                                type="number"
                                step="0.01"
                                min="0"
                              />
                              <div>%</div>
                            </div>
                          </div>
                        )
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </div>
        </div>
      </form>
      <div className="absolute flex bottom-24 left-1/2 -translate-x-1/2 justify-center">
        <button
          onClick={submitForm}
          className="rounded-lg bg-slate-200 hover:bg-green-400 transition-colors py-2 px-20 "
        >
          Speichern
        </button>
      </div>
    </div>
  );
};

export default NewSpending;
