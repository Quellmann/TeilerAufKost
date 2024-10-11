import React, { useState, useEffect } from "react";
import { Input } from "@headlessui/react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";
import clsx from "clsx";

const NewTransaction = ({ emblaApi }) => {
  const [data, setData] = useState([]);
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const disabledForms =
    queryParams.has("amount") &&
    queryParams.has("from") &&
    queryParams.has("to");
  const [form, setForm] = useState({
    title: "Zahlung",
    amount: "",
    from: "",
    to: [{ name: "", amount: 0 }],
    isBalancingTransaction: true,
  });

  const formValidation = () => {
    !form.amount && toast.error("Gib einen gültigen Betrag an");
    !form.from && toast.error("Wähle bitte einen Versender");
    !form.to.at(0).name && toast.error("Wähle bitte einen Empfänger");

    return form.amount && form.from && form.to.at(0).name;
  };

  const submitForm = async () => {
    if (formValidation()) {
      emblaApi.scrollTo(0);
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
    const amount = queryParams.get("amount");
    const from = queryParams.get("from");
    const to = queryParams.get("to");
    if (disabledForms) {
      setForm({
        title: "Ausgleichszahlung",
        amount: +amount,
        from: from,
        to: [{ name: to, amount: +amount }],
        isBalancingTransaction: true,
      });
    }
  }, [location]);

  useEffect(() => {
    if (!disabledForms) {
      setForm((prev) => ({
        ...prev,
        to: [{ name: form.to.at(0).name, amount: form.amount }],
      }));
    }
  }, [form.amount]);

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
    }
    groupId && fetchData();
    return;
  }, [groupId]);

  return (
    <div className="">
      <form className="flex flex-col" autoComplete="off">
        <div className="text-3xl mb-8 pl-3">Neue {form.title} hinzufügen</div>
        <div className="text-lg pl-3 mt-3">
          <Input
            onChange={(e) =>
              setForm((prevState) => ({
                ...prevState,
                amount: parseFloat(e.target.value),
              }))
            }
            value={form.amount}
            disabled={disabledForms}
            placeholder="Betrag"
            className="border w-full rounded-lg py-2 text-center"
            name="spending_amount"
            type="number"
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
              disabled={disabledForms}
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
                {data.groupMember
                  ?.filter((member) => form.to.at(0).name != member)
                  .map((person, index) => (
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
              value={form.to.at(0).name}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  to: [{ name: value, amount: form.amount }],
                }))
              }
              disabled={disabledForms}
            >
              <ListboxButton
                className={clsx(
                  "relative block w-full rounded-lg border bg-slate-100 py-1.5 pr-8 pl-3 text-left text-sm/6 text-black min-h-10",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                )}
              >
                {form.to.at(0).name}
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
                {data.groupMember
                  ?.filter((member) => form.from != member)
                  .map((person, index) => (
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
        </div>
      </form>
      <div className="flex justify-center mt-20">
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

export default NewTransaction;
