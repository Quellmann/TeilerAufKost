import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { PencilSquareIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const Spendings = ({ spendings }) => {
  const [search, setSearch] = useState("");
  const [focusedSpending, setFocusedSpending] = useState(undefined);
  const [isOpen, setIsOpen] = useState(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const [setSidebarGroups, refresh, emblaApi] = useOutletContext();

  useEffect(() => {
    if (searchParams.get("focus")) {
      setFocusedSpending(+searchParams.get("focus"));
    }
    return;
  }, [searchParams]);

  const handleOpenState = (index) => {
    if (focusedSpending === index) {
      setFocusedSpending(undefined);
      setSearchParams({
        groupId: searchParams.get("groupId"),
      });
    } else {
      setFocusedSpending(index);
      setSearchParams({
        groupId: searchParams.get("groupId"),
        focus: index,
      });
    }
  };

  const handleEditSpending = (spending) => {
    setSearchParams({
      groupId: searchParams.get("groupId"),
      mode: "edit",
      spending: spending._id,
      type: spending.isBalancingTransaction ? "transaction" : "spending",
      title: spending.title,
      amount: spending.amount,
      tip: spending.tip,
      from: JSON.stringify(spending.from),
      to: JSON.stringify(spending.to),
    });
    emblaApi.scrollTo(3);
  };

  return (
    <div className="">
      {/* <div className="my-1 relative">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Suche.."
          className="border w-full rounded-lg p-2 pl-10"
          name="search_spendings"
          type="text"
        />
        <MagnifyingGlassIcon className="absolute top-0 left-1 translate-y-2.5 translate-x-1 size-6 "></MagnifyingGlassIcon>
      </div> */}
      <div className="flex flex-col mt-5 border rounded-lg divide-y m-0.5">
        {spendings.length === 0 ? (
          <div className="p-3">Es wurden noch keine Ausgaben verbucht.</div>
        ) : (
          spendings
            .filter((spending) =>
              search
                ? spending.title.toLowerCase().includes(search.toLowerCase())
                : spending
            )
            .map((spending, index) => (
              <div key={index}>
                <button
                  onClick={() => handleOpenState(index)}
                  className="grid grid-flow-col grid-cols-4 col-auto items-center w-full p-4 focus:outline-none"
                >
                  <div className="text-left col-span-2">
                    <span className="text-md">{spending.title}</span>
                    <div className="justify-self-start text-sm text-black/50">
                      {new Date(spending.createdAt).toLocaleDateString(
                        "de-DE",
                        { timeZone: "Europe/Berlin" }
                      )}
                    </div>
                  </div>
                  <div className="text-right">{spending.amount}€</div>
                  <div className="flex justify-end">
                    <ChevronDownIcon
                      className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${
                        index == focusedSpending ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </button>

                {/* Content with transition */}
                <div
                  className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
                    index == focusedSpending ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <div className="rounded-b-lg p-4 bg-white text-gray-700">
                    <div className="text-sm grid grid-cols-8">
                      <div className="col-span-3">
                        <div className="text-lg border-b">Von:</div>
                        <div className="truncate pr-2">{spending.from}</div>
                      </div>
                      <div className="col-span-3 justify-self-start w-full">
                        <div className="text-lg border-b">An:</div>
                        {spending.to.map((person, index) => (
                          <div key={index} className="truncate pr-2">
                            {person.name}
                          </div>
                        ))}
                      </div>
                      <div className="col-span-2 justify-self-start w-full">
                        <div className="text-lg border-b">Betrag:</div>
                        {spending.to.map((person, index) => (
                          <div key={index} className="grid grid-cols-2 gap-x-1">
                            <div className="text-right">
                              {person.amount.toFixed(2)}
                            </div>
                            <div>€</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-8 mt-5 border-t text-sm items-center">
                      <div className="col-span-3">Trinkgeld:</div>
                      <div className="col-span-3">
                        <div>Gesamt</div>
                        <div>Pro Person</div>
                      </div>
                      <div className="col-span-2 text-sky-400 grid grid-cols-2 gap-x-1">
                        <div className="text-right">
                          {spending.tip.toFixed(2)}
                        </div>
                        <div> €</div>
                        <div className="text-right">
                          {(spending.tip / spending.to.length).toFixed(2)}
                        </div>
                        <div>€</div>
                      </div>
                    </div>
                    <div className="flex justify-start mt-5 ">
                      <button
                        onClick={() => handleEditSpending(spending)}
                        className="flex items-center"
                      >
                        <PencilSquareIcon className="size-6"></PencilSquareIcon>
                        <div className="text-sm">Bearbeiten</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Spendings;
