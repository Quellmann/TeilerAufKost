import React, { useState, useEffect } from "react";
import { Input } from "@headlessui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

const NewSpending = ({ emblaApi, setRefresh }) => {
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    from: "",
    to: [{ name: "", amount: 0 }],
    individualValueHistory: [],
  });

  const [percentages, setPercentages] = useState({});

  useEffect(() => {
    if (searchParams.get("spending")) {
      setEditMode(true);
      setForm({
        title: searchParams.get("title"),
        amount: searchParams.get("amount"),
        from: JSON.parse(searchParams.get("from")),
        to: JSON.parse(searchParams.get("to")),
        individualValueHistory: [],
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
    setForm((prev) => ({
      ...prev,
      to: form.to.map((elmt) => elmt.name).includes(member)
        ? form.to.filter((elmt) => elmt.name != member)
        : [...form.to, { name: member, amount: 0 }],
    }));
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const individualValueHandler = (input, value, person) => {
    value = value.replace(/,/g, ".");
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }
    value = value.replace(/[^0-9.]/g, "");
    if (!value.endsWith(".")) {
      const convertedValue = +(input === "percent"
        ? ((form.amount * value) / 100).toFixed(2)
        : value);

      if (input === "percent") {
        setPercentages((prev) => ({
          ...prev,
          person: (value / form.amount) * 100,
        }));
      }

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
    } else {
      setForm((prev) => ({
        ...prev,
        to: prev.to.map((elmt) =>
          elmt.name === person ? { ...elmt, amount: value } : elmt
        ),
      }));
    }
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
      console.log(remainingAmount / uneditedCount);
      let newSplit = parseFloat((remainingAmount / uneditedCount).toFixed(2));
      // let newSplit = parseFloat(remainingAmount / uneditedCount);

      const notSplittable =
        form.amount - editedTotal - newSplit * uneditedCount;

      console.log(notSplittable);

      if (notSplittable > 0.001) {
        toast.dismiss();
        toast(
          `Restbetrag ${notSplittable.toFixed(
            2
          )}€ nicht teilbar.\n Personen zahlen 1 Cent mehr`
        );
        newSplit += 0.01;
      } else if (notSplittable < 0) {
        toast.dismiss();
        toast(
          `Restbetrag ${notSplittable.toFixed(
            2
          )}€ nicht teilbar.\n Personen zahlen 1 Cent mehr`
        );
      }

      setForm((prev) => ({
        ...prev,
        to: prev.to.map((member) => {
          if (form.individualValueHistory.includes(member.name)) {
            return member;
          } else {
            setPercentages((prev) => ({
              ...prev,
              [member.name]: newSplit.toFixed(2)
                ? ((newSplit / form.amount) * 100).toFixed(2)
                : "",
            }));
            return { ...member, amount: newSplit.toFixed(2) };
          }
        }),
      }));
    }
  };

  useEffect(() => {
    // console.log(percentages);
  }, [percentages]);

  useEffect(() => {
    recalculateUneditedMembers();
  }, [form.individualValueHistory, form.to.length, form.amount]);

  // useEffect(() => {
  //   if (form.to.length > 0) {
  //     setForm((prev) => ({
  //       ...prev,
  //       to: prev.to.map((member) => ({
  //         ...member,
  //         amount: form.individualValueHistory.includes(member.name)
  //           ? member.amount
  //           : (form.amount / form.to.length).toFixed(2),
  //       })),
  //     }));
  //   }
  // }, [form.to.length, form.amount]);

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
      emblaApi.scrollTo(1);
      const response = await fetch(`${API_BASE_URL}/${groupId}/newSpending`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const group = await response.json();
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
      setForm((prevState) => ({
        ...prevState,
        to: data.groupMember?.map((member) => ({ name: member, amount: 0 })),
      }));
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
        <div className="text-lg mt-3 flex justify-center">
          <Input
            onChange={(e) => handleAmountInput(e)}
            value={form.amount}
            placeholder="Betrag"
            className="border rounded-lg py-2 text-center"
            name="spending_amount"
            type="number"
            step="0.01"
            min="0"
          />
        </div>
        <div className="flex flex-col justify-center border rounded-lg mt-10 divide-y">
          <div className="self-center text-lg p-2">Bezahlt von:</div>
          <div className="flex overflow-auto justify-between gap-3 p-2">
            {data.groupMember?.map((member, index) => (
              <div
                key={index}
                onClick={() => setForm((prev) => ({ ...prev, from: member }))}
                className={`w-20 h-20 border rounded-full flex flex-shrink-0 justify-center transition-colors duration-200 items-center cursor-pointer ${
                  form.from == member ? "bg-amber-500 text-slate-50" : ""
                }`}
              >
                <span className="truncate p-2 select-none">{member}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center border rounded-lg mt-10 divide-y">
          <div className="self-center text-lg p-2">Für:</div>
          <div className="flex overflow-auto justify-between items-start gap-5 p-2">
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
                  <span className="truncate p-2 select-none">{member}</span>
                </div>
                {form.to.map((elmt) => elmt.name).includes(member) && (
                  <>
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
              submitForm();
            }}
            className="rounded-lg bg-slate-200 hover:bg-red-400 transition-colors py-2 px-10 "
          >
            Löschen
          </button>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            submitForm();
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
