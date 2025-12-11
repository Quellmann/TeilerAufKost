import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Listbox, ListboxButton } from "@headlessui/react";
import clsx from "clsx";

export default function ComboInput({ data, form, setForm, formfield, type }) {
  const [selectedPeople, setSelectedPeople] = useState([]);

  useEffect(() => {
    setForm((prevState) => ({ ...prevState, [formfield]: selectedPeople }));
    return;
  }, [selectedPeople]);

  const handleDisplayedPeople = () => {
    if (form[formfield].length > 1 && type == "multiple") {
      return form[formfield].length + " Personen";
    } else if (form[formfield].length > 1) {
      return selectedPeople;
    }
    return form[formfield];
  };

  useEffect(() => {
    console.log(form);

    return;
  }, [form]);

  return (
    <Listbox
      value={[]}
      onChange={setSelectedPeople}
      {...(type == "multiple" && { multiple: true })}
    >
      <ListboxButton
        className={clsx(
          "relative block w-full rounded-lg border bg-slate-100 py-1.5 pr-8 pl-3 text-left text-sm/6 text-black min-h-10",
          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
        )}
      >
        {/* {handleDisplayedPeople()} */}
        <ChevronDownIcon
          className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black/60"
          aria-hidden="true"
        />
      </ListboxButton>
      {/* <ListboxOptions anchor="bottom"
                transition
                className={clsx(
                    'w-[var(--button-width)] rounded-xl border border-slate-200 bg-slate-100 p-1 mt-1 [--anchor-gap:var(--spacing-1)] focus:outline-none',
                    'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                )}>
                {type == ("depending") ? data.groupMember?.filter((person) => formfield == "to" ? person != form.from : form.to.length >= 1 ? !form.to.includes(person) : 1).map((person, index) => (
                    <ListboxOption key={index} value={person} className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10">
                        <CheckIcon className="invisible size-4 fill-black group-data-[selected]:visible" />
                        <div className="text-sm/6 text-black">{person}</div>
                    </ListboxOption>
                )) :
                    data.groupMember?.map((person, index) => (
                        <ListboxOption key={index} value={person} className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10">
                            <CheckIcon className="invisible size-4 fill-black group-data-[selected]:visible" />
                            <div className="text-sm/6 text-black">{person}</div>
                            <div className="text-sm/6 text-black">{ }€</div>
                            <div className="text-sm/6 text-black">{ }%</div>
                        </ListboxOption>
                    ))}
            </ListboxOptions> */}
    </Listbox>
  );
}
