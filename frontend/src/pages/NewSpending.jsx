import React, { useState, useEffect } from "react";
import { Input } from "@headlessui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";

const NewSpending = ({ emblaApi, setRefresh }) => {
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    tip: "",
    from: "",
    to: [{ name: "", amount: 0 }],
    individualValueHistory: [],
  });
  const [percentagesEnabled, setPercentagesEnabled] = useState(false);
  const [percentages, setPercentages] = useState({});

  useEffect(() => {
    if (searchParams.get("spending")) {
      setEditMode(true);
      setForm({
        title: searchParams.get("title"),
        amount: searchParams.get("amount"),
        from: JSON.parse(searchParams.get("from")),
        to: JSON.parse(searchParams.get("to")),
        individualValueHistory: JSON.parse(searchParams.get("to")).map(
          (elmt) => elmt.name
        ),
      });
    }
    return;
  }, [searchParams]);

  const formValidation = () => {
    !form.title && toast.error("Gib einen gültigen Titel an");
    !form.amount && toast.error("Gib einen gültigen Betrag an");
    !form.from && toast.error("Wähle bitte einen Bezahlenden");
    !form.to.length > 0 && toast.error("Wähle bitte die Empfänger");

    return form.title && form.amount && form.from && form.to.length > 0;
  };

  const handleMultiplePersonSelection = (member) => {
    if (form.to.map((elmt) => elmt.name).includes(member)) {
      setForm((prev) => ({
        ...prev,
        individualValueHistory: prev.individualValueHistory.filter(
          (elmt) => elmt != member
        ),
        to: form.to.filter((elmt) => elmt.name != member),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        to: [...form.to, { name: member, amount: 0 }],
      }));
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const individualValueHandler = (input, value, person) => {
    value = value.replace(/,/g, ".");
    const parts = value.split(".");
    if (parts.length > 1) {
      value = parts[0] + "." + parts.slice(1).join("").substring(0, 2);
    }
    value = value.replace(/[^0-9.]/g, "");

    if (!value.endsWith(".")) {
      // if input is in percent do this
      if (input === "percent") {
        setPercentages((prev) => ({
          ...prev,
          [person]: value,
        }));
        setForm((prev) => ({
          ...prev,
          to: prev.to.map((elmt) =>
            elmt.name === person
              ? { ...elmt, amount: ((value / 100) * form.amount).toFixed(2) }
              : elmt
          ),
        }));
      } else {
        // if input is in € do this
        setPercentages((prev) => ({
          ...prev,
          [person]: ((value / form.amount) * 100).toFixed(2),
        }));
        setForm((prev) => ({
          ...prev,
          to: prev.to.map((elmt) =>
            elmt.name === person ? { ...elmt, amount: value } : elmt
          ),
        }));
      }
    } else {
      if (input === "percent") {
        setPercentages((prev) => ({
          ...prev,
          [person]: value,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          to: prev.to.map((elmt) =>
            elmt.name === person ? { ...elmt, amount: value } : elmt
          ),
        }));
      }
    }
    // set edit history
    setForm((prev) => ({
      ...prev,
      individualValueHistory: [
        ...prev.individualValueHistory.filter((elmt) => elmt != person),
        person,
      ],
    }));
  };

  const recalculateUneditedMembers = () => {
    const editedTotal = form.to
      .filter((member) => form.individualValueHistory.includes(member.name))
      .reduce((a, b) => a + +b.amount, 0);
    const uneditedCount = form.to.length - form.individualValueHistory.length;
    const remainingAmount = form.amount - editedTotal;

    if (remainingAmount < 0) {
      toast.dismiss();
      toast(
        "Individueller Betrag größer als der Gesamtbetrag. Beträge werden zurück-\ngesetzt, bis Teilung möglich ist."
      );
      setForm((prev) => ({
        ...prev,
        individualValueHistory: prev.individualValueHistory.slice(1),
      }));
    } else if (uneditedCount === 0 && remainingAmount) {
      const lastChange = form.individualValueHistory.at(0);

      setForm((prev) => ({
        ...prev,
        to: prev.to.map((member) =>
          lastChange === member.name
            ? {
                ...member,
                amount: +member.amount + parseFloat(remainingAmount),
              }
            : member
        ),
      }));
    } else {
      let newSplit = parseFloat(
        (Math.floor((remainingAmount / uneditedCount) * 100) / 100).toFixed(2)
      );

      const notSplittable =
        form.amount - editedTotal - newSplit * uneditedCount;

      if (notSplittable > 0.001) {
        toast.dismiss();
        toast(
          `Restbetrag ${notSplittable.toFixed(
            2
          )}€ nicht gleichmäßig teilbar. Personen zahlen 1 Cent mehr`
        );
        newSplit += 0.01;
      }
      const newAmounts = form.to.map((member) =>
        form.individualValueHistory.includes(member.name)
          ? member
          : { ...member, amount: +newSplit.toFixed(2) }
      );

      const sumOfAmounts = newAmounts.reduce((a, b) => a + +b.amount, 0);

      setForm((prev) => ({
        ...prev,
        to: prev.to.map((member) => {
          if (prev.individualValueHistory.includes(member.name)) {
            setPercentages((prev) => ({
              ...prev,
              [member.name]:
                sumOfAmounts === 0
                  ? 0
                  : +((member.amount / sumOfAmounts) * 100).toFixed(2),
            }));
            return member;
          } else {
            setPercentages((prev) => ({
              ...prev,
              [member.name]:
                sumOfAmounts === 0
                  ? 0
                  : +((newSplit / sumOfAmounts) * 100).toFixed(2),
            }));
            return { ...member, amount: +newSplit.toFixed(2) };
          }
        }),
      }));
    }
  };

  useEffect(() => {
    recalculateUneditedMembers();
  }, [form.individualValueHistory, form.to.length, form.amount]);

  const handleAmountInput = (value, type) => {
    value = value.replace(/,/g, ".");
    const parts = value.split(".");
    if (parts.length > 1) {
      value = parts[0] + "." + parts.slice(1).join("").substring(0, 2);
    }
    value = value.replace(/[^0-9.]/g, "");

    if (type === "amount") {
      setForm((prevState) => ({ ...prevState, amount: value }));
    } else if (type === "tip") {
      setForm((prevState) => ({ ...prevState, tip: value }));
    }
  };

  const submitForm = async (type) => {
    if (formValidation()) {
      emblaApi.scrollTo(1);
      if (type === "new") {
        const response = await fetch(`${API_BASE_URL}/${groupId}/newSpending`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      } else if (type === "update") {
        const response = await fetch(
          `${API_BASE_URL}/${searchParams.get("spending")}/updateSpending`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );
      } else if (type === "delete") {
        const response = await fetch(
          `${API_BASE_URL}/${searchParams.get("spending")}/deleteSpending`,
          {
            method: "DELETE",
          }
        );
      }
      setRefresh(new Date());
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
    }
    groupId && fetchData();
    return;
  }, [groupId]);

  return (
    <form className="flex flex-col justify-between grow" autoComplete="off">
      <div className="flex flex-col grow">
        <div className="text-3xl mb-8">
          {editMode ? "Ausgabe bearbeiten" : "Neue Ausgabe hinzufügen"}
        </div>
        <div className="text-lg">
          <Input
            onChange={(e) =>
              setForm((prevState) => ({ ...prevState, title: e.target.value }))
            }
            value={form.title}
            placeholder="Titel"
            className="border w-full rounded-lg p-2 text-center"
            name="spending_title"
            type="text"
          />
        </div>
        <div className=" text-lg mt-10 flex justify-center gap-3">
          <div className="relative">
            <Input
              onChange={(e) => handleAmountInput(e.target.value, "amount")}
              value={form.amount}
              placeholder="Betrag"
              className="border rounded-lg py-2 px-4 text-center"
              name="spending_amount"
            />
            <div className="absolute right-2 top-2.5 text-black/50">€</div>
          </div>
        </div>

        <div className="text-lg mt-3 flex justify-center gap-3">
          <div className="relative">
            <Input
              onChange={(e) => handleAmountInput(e.target.value, "tip")}
              value={form.tip}
              placeholder="Trinkgeld"
              className="border rounded-lg py-2 px-4 text-center text-sky-400"
              name="tip_amount"
            />
            <div className="absolute right-2 top-2.5 text-black/50">€</div>
            <InformationCircleIcon
              onClick={() => {
                toast.dismiss();
                toast(
                  "Trinkgeld wird unter allen Zahlenden zu gleichen Anteilen aufgeteilt."
                );
              }}
              className="absolute top-3 right-0 translate-x-8 size-6 text-black/50"
            ></InformationCircleIcon>
          </div>
        </div>
        <div className="flex flex-col justify-center border rounded-lg mt-10 divide-y">
          <div className="self-start text-lg p-2">Bezahlt von:</div>
          <div className="flex overflow-auto justify-between gap-3 p-4">
            {data.groupMember?.map((member, index) => (
              <div
                key={index}
                onClick={() => setForm((prev) => ({ ...prev, from: member }))}
                className={`w-20 h-20 border rounded-full flex flex-shrink-0 justify-center transition-colors duration-200 items-center cursor-pointer ${
                  form.from == member ? "bg-amber-500 text-slate-50" : ""
                }`}
              >
                <div className="p-1 text-ellipsis whitespace-normal break-all line-clamp-2 select-none text-center">
                  {member}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex relative flex-col justify-center border rounded-lg mt-10 divide-y">
          <div className="self-start text-lg p-2">
            Für: {form.to.length} Personen
            <div className="absolute top-3 right-2 flex gap-2">
              <div className="text-black/50">€</div>
              <Switch
                checked={percentagesEnabled}
                onChange={setPercentagesEnabled}
                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-400 transition "
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
              </Switch>
              <div className="text-black/50">%</div>
            </div>
          </div>
          <div className="flex overflow-auto justify-between items-start gap-5 p-4">
            {data.groupMember?.map((member, index) => (
              <div key={index} className="flex flex-col justify-center">
                <div
                  key={index}
                  onClick={() => handleMultiplePersonSelection(member)}
                  className={`w-20 h-20 border rounded-full flex flex-shrink-0 justify-center transition-colors duration-200 items-center cursor-pointer ${
                    form.to.map((elmt) => elmt.name).includes(member)
                      ? "bg-slate-600 text-slate-50"
                      : ""
                  }`}
                >
                  <div className="p-1 text-ellipsis whitespace-normal break-all line-clamp-2 select-none text-center">
                    {member}
                  </div>
                </div>
                {form.to.map((elmt) => elmt.name).includes(member) && (
                  <>
                    {percentagesEnabled ? (
                      <div className="flex items-center pt-2 relative">
                        <Input
                          autoComplete="off"
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) =>
                            individualValueHandler(
                              "percent",
                              e.target.value,
                              member
                            )
                          }
                          value={percentages[member]}
                          className="border w-20 rounded-lg text-right pr-5"
                        />
                        <div className="text-black/50 absolute right-1">%</div>
                      </div>
                    ) : (
                      <div className="flex items-center pt-2 relative">
                        <Input
                          autoComplete="off"
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) =>
                            individualValueHandler(
                              "amount",
                              e.target.value,
                              member
                            )
                          }
                          value={
                            form.to.find((elmt) => elmt.name === member).amount
                          }
                          className="border w-20 rounded-lg text-right pr-5"
                        />
                        <div className="text-black/50 absolute right-2">€</div>
                      </div>
                    )}
                    {form.tip && (
                      <div className="flex h-5 relative justify-center text-sky-400">
                        <div className="absolute top-0 right-2">
                          {(form.tip / form.to.length).toFixed(2)} €
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-around my-10">
        {editMode && (
          <button
            onClick={(e) => {
              e.preventDefault();
              submitForm("delete");
            }}
            className="rounded-lg bg-slate-200 hover:bg-red-400 transition-colors py-2 px-10 "
          >
            Löschen
          </button>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            submitForm(editMode ? "update" : "new");
          }}
          className="rounded-lg bg-slate-200 hover:bg-green-400 transition-colors py-2 px-10"
        >
          {editMode ? "Update" : "Speichern"}
        </button>
      </div>
    </form>
  );
};

export default NewSpending;
