import React, { useState, useEffect } from "react";
import { Input } from "@headlessui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";
import DeleteModal from "../components/DeleteModal";

const NewSpending = ({ emblaApi, setRefresh }) => {
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    tip: "",
    from: "",
    to: [],
    individualValueHistory: [],
    isBalancingTransaction: false,
  });
  const [percentagesEnabled, setPercentagesEnabled] = useState(false);
  const [percentages, setPercentages] = useState({});
  const [userHasEdited, setUserHasEdited] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("spending")) {
      setEditMode(true);
      let formMinusTip = {
        title: searchParams.get("title"),
        amount: searchParams.get("amount"),
        tip: searchParams.get("tip"),
        from: JSON.parse(searchParams.get("from")),
        to: JSON.parse(searchParams.get("to")),
        individualValueHistory: JSON.parse(searchParams.get("to")).map(
          (elmt) => elmt.name
        ),
        isBalancingTransaction:
          searchParams.get("type") === "transaction" ? true : false,
      };
      formMinusTip = {
        ...formMinusTip,
        amount: +formMinusTip.amount - +formMinusTip.tip,
        to: formMinusTip.to.map((member) => ({
          ...member,
          amount: (
            +member.amount -
            +(+formMinusTip.tip / formMinusTip.to.length).toFixed(2)
          ).toFixed(2),
        })),
      };
      setForm(formMinusTip);

      const sumOfAmounts = formMinusTip.to.reduce((a, b) => a + +b.amount, 0);
      setPercentages((prev) =>
        formMinusTip.to.reduce((acc, member) => {
          acc[member.name] =
            sumOfAmounts === 0
              ? 0
              : +((member.amount / sumOfAmounts) * 100).toFixed(2);
          return acc;
        }, {})
      );
    } else if (searchParams.get("type") === "transaction") {
      setForm((prev) => ({
        ...prev,
        title: "Ausgleichszahlung",
        amount: searchParams.get("amount"),
        from: searchParams.get("from"),
        to: [
          {
            name: searchParams.get("to"),
            amount: searchParams.get("amount"),
          },
        ],
        isBalancingTransaction: true,
      }));
      setPercentages((prev) => ({ ...prev, [searchParams.get("to")]: 100 }));
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
    setUserHasEdited(true);
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

  const handleBlur = (member, type) => {
    switch (type) {
      case "amount": {
        recalculateUneditedMembers();
        break;
      }
      case "personal_percent": {
        setForm((prev) => ({
          ...prev,
          to: prev.to.map((elmt) =>
            elmt.name === member
              ? {
                  ...elmt,
                  amount: ((percentages[member] / 100) * form.amount).toFixed(
                    2
                  ),
                }
              : elmt
          ),
        }));
        // set edit history
        setForm((prev) => ({
          ...prev,
          individualValueHistory: [
            ...prev.individualValueHistory.filter((elmt) => elmt != member),
            member,
          ],
        }));
        break;
      }
      case "personal_amount": {
        // set edit history
        setForm((prev) => ({
          ...prev,
          individualValueHistory: [
            ...prev.individualValueHistory.filter((elmt) => elmt != member),
            member,
          ],
        }));
        break;
      }
    }
  };

  const individualValueHandler = (input, value, person) => {
    setUserHasEdited(true);
    value = value.replace(/,/g, ".");
    const parts = value.split(".");
    if (parts.length > 1) {
      value = parts[0] + "." + parts.slice(1).join("").substring(0, 2);
    }
    value = value.replace(/[^0-9.]/g, "");

    // if input is in percent do this
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
  };

  const recalculateUneditedMembers = () => {
    if (userHasEdited) {
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
        // this state change triggers a recall of this function by the useEffect down below

        setForm((prev) => ({
          ...prev,
          individualValueHistory: prev.individualValueHistory.slice(1),
        }));
        // recalculateUneditedMembers();
      } else if (uneditedCount === 0 && remainingAmount) {
        const lastChange = form.individualValueHistory.at(0);

        setForm((prev) => ({
          ...prev,
          to: prev.to.map((member) => {
            if (lastChange === member.name) {
              setPercentages((prev) => ({
                ...prev,
                [member.name]: +(
                  ((+member.amount + +remainingAmount) / +form.amount) *
                  100
                ).toFixed(2),
              }));
              return {
                ...member,
                amount: (+member.amount + parseFloat(remainingAmount)).toFixed(
                  2
                ),
              };
            } else {
              return member;
            }
          }),
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
            )}€ nicht gleichmäßig teilbar. Beträge werden einheitlich aufgerundet.`
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
    }
  };

  useEffect(() => {
    recalculateUneditedMembers();
  }, [form.to.length, form.individualValueHistory]);

  const handleAmountInput = (value, type) => {
    setUserHasEdited(true);
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
      const formAndTip = {
        ...form,
        amount: +form.amount + +form.tip,
        tip: form.tip ? form.tip : 0,
        to: form.to.map((member) => ({
          ...member,
          amount: +member.amount + +(+form.tip / form.to.length).toFixed(2),
        })),
      };
      if (type === "new") {
        const response = await fetch(`${API_BASE_URL}/${groupId}/newSpending`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formAndTip),
        });
      } else if (type === "update") {
        const response = await fetch(
          `${API_BASE_URL}/${searchParams.get("spending")}/updateSpending`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formAndTip),
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
      console.log(formAndTip);
      setRefresh(new Date());
      setSearchParams({ groupId: searchParams.get("groupId") });
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

      if (!(searchParams.get("mode") === "edit")) {
        setForm((prev) => ({
          ...prev,
          to: data.groupMember.map((member) => ({
            name: member.name,
            amount: 0,
          })),
        }));
        data.groupMember.map((member) =>
          setPercentages((prev) => ({ ...prev, [member.name]: 0 }))
        );
      }
    }
    groupId && fetchData();
    return;
  }, [groupId]);

  return (
    <form className="flex flex-col justify-between grow" autoComplete="off">
      <div className="flex flex-col grow">
        <div className="text-3xl mb-8">
          {editMode
            ? form.isBalancingTransaction
              ? "Transaktion bearbeiten"
              : "Ausgabe bearbeiten"
            : form.isBalancingTransaction
            ? "Neue Transaktion hinzufügen"
            : "Neue Ausgabe hinzufügen"}
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
        <div className=" text-lg mt-5 flex justify-center gap-3">
          <div className="relative">
            <Input
              onChange={(e) => handleAmountInput(e.target.value, "amount")}
              onFocus={(e) => handleFocus(e)}
              onBlur={(e) => handleBlur(e, "amount")}
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
              onFocus={(e) => handleFocus(e)}
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
        <div className="text-lg mt-3 flex justify-center gap-3">
          <div className="relative flex items-center">
            <div className="text-black/50 pr-2">Ausgabe</div>
            <Switch
              checked={form.isBalancingTransaction}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isBalancingTransaction: e }))
              }
              className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-400 transition"
            >
              <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
            </Switch>
            <div className="text-black/50 pl-2">Transaktion</div>
            <InformationCircleIcon
              onClick={() => {
                toast.dismiss();
                toast(
                  "Transaktionen sind Geldbewegungen, die nicht als Verbrauch gewertet werden. Beispielsweise wenn du einer Person 10€ gibst, um gemeinsam eine Rechnung zu begleichen."
                );
              }}
              className="absolute top-1 right-1 translate-x-11 size-6 text-black/50"
            ></InformationCircleIcon>
          </div>
        </div>
        <div className="flex flex-col justify-center border rounded-lg mt-5 divide-y">
          <div className="self-start text-lg p-2">Bezahlt von:</div>
          <div className="flex overflow-auto justify-between gap-3 p-4">
            {data.groupMember?.map((member, index) => (
              <div
                key={index}
                onClick={() =>
                  setForm((prev) => ({ ...prev, from: member.name }))
                }
                className={`w-20 h-20 border rounded-full flex flex-shrink-0 justify-center transition-colors duration-200 items-center cursor-pointer ${
                  form.from == member.name ? "bg-amber-500 text-slate-50" : ""
                }`}
              >
                <div className="p-1 text-ellipsis whitespace-normal break-all line-clamp-2 select-none text-center">
                  {member.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex relative flex-col justify-center border rounded-lg mt-5 divide-y">
          <div className="self-start text-lg p-2">
            Für: {form.to.length} Personen
            <div className="absolute top-2 right-2 flex gap-2 items-center">
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
                  onClick={() => handleMultiplePersonSelection(member.name)}
                  className={`w-20 h-20 border rounded-full flex flex-shrink-0 justify-center transition-colors duration-200 items-center cursor-pointer ${
                    form.to.map((elmt) => elmt.name).includes(member.name)
                      ? "bg-slate-600 text-slate-50"
                      : ""
                  }`}
                >
                  <div className="p-1 text-ellipsis whitespace-normal break-all line-clamp-2 select-none text-center">
                    {member.name}
                  </div>
                </div>
                {form.to.map((elmt) => elmt.name).includes(member.name) && (
                  <>
                    {percentagesEnabled ? (
                      <div className="flex items-center pt-2 relative">
                        <Input
                          autoComplete="off"
                          onFocus={(e) => handleFocus(e)}
                          onBlur={() =>
                            handleBlur(member.name, "personal_percent")
                          }
                          onChange={(e) =>
                            individualValueHandler(
                              "percent",
                              e.target.value,
                              member.name
                            )
                          }
                          value={percentages[member.name]}
                          className="border w-20 rounded-lg text-right pr-5"
                        />
                        <div className="text-black/50 absolute right-1">%</div>
                      </div>
                    ) : (
                      <div className="flex items-center pt-2 relative">
                        <Input
                          autoComplete="off"
                          onFocus={(e) => handleFocus(e)}
                          onBlur={() =>
                            handleBlur(member.name, "personal_amount")
                          }
                          onChange={(e) =>
                            individualValueHandler(
                              "amount",
                              e.target.value,
                              member.name
                            )
                          }
                          value={
                            form.to.find((elmt) => elmt.name === member.name)
                              .amount
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
              setIsOpen(true);
            }}
            className="rounded-lg bg-slate-200 hover:bg-red-500 hover:text-white transition-colors py-2 px-10 "
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
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        text={"Bitte bestätige, dass du diese Ausgabe löschen willst."}
        callback={() => submitForm("delete")}
      ></DeleteModal>
    </form>
  );
};

export default NewSpending;
