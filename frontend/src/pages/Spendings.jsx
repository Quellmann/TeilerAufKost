import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { API_BASE_URL } from "../config";

const Spendings = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [spendings, setSpendings] = useState([]);
  const { groupId } = useParams();

  async function fetchData() {
    try {
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
      return Promise.resolve();
    } catch (error) {
      console.error("Fetch data error:", error);
      throw error;
    }
  }

  useEffect(() => {
    groupId && fetchData();
    return;
  }, [groupId]);

  return (
    <div className="h-full overflow-auto">
      <div className="flex flex-col 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] mx-auto">
        <div className="text-3xl py-8 pl-3 truncate">
          {data.groupName}-Historie
        </div>
        <div className="text-lg pl-3">Ausgaben</div>
        <div className="my-1 relative">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suche.."
            className="border w-full rounded-lg p-2 pl-10"
            name="search_spendings"
            type="text"
          />
          <MagnifyingGlassIcon className="absolute top-0 left-1 translate-y-2.5 translate-x-1 size-6 "></MagnifyingGlassIcon>
        </div>
        <div className="flex flex-col mt-5 border rounded-lg divide-y">
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
                <Disclosure as="div" key={spending._id} className="">
                  <DisclosureButton className="group p-3 w-full flex items-center">
                    <div className="flex sm:grid sm:grid-cols-5 w-full gap-2 sm:gap-0 items-center">
                      <div className="w-2/3 sm:col-span-2 justify-self-start text-xl text-left overflow-hidden text-ellipsis whitespace-nowrap">
                        {spending.title}
                        <div className="sm:hidden justify-self-start text-base sm:text-xl">
                          {new Date(spending.createdAt).toLocaleDateString(
                            "de-DE",
                            { timeZone: "Europe/Berlin" }
                          )}
                        </div>
                      </div>
                      <div className="justify-self-start text-xl">
                        {spending.amount}€
                      </div>
                      <div className="hidden sm:block justify-self-start text-base sm:text-xl">
                        {new Date(spending.createdAt).toLocaleDateString(
                          "de-DE",
                          { timeZone: "Europe/Berlin" }
                        )}
                      </div>
                      <ChevronDownIcon className="size-5 justify-self-end hidden sm:block group-data-[open]:rotate-180" />
                    </div>
                    <div className="">
                      <ChevronDownIcon className="size-5 justify-self-end sm:hidden group-data-[open]:rotate-180" />
                    </div>
                  </DisclosureButton>
                  <DisclosurePanel
                    transition
                    className="mt-2 p-3 text-sm grid grid-cols-5 origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                  >
                    <div className="col-span-3">
                      <div className="text-lg border-b">Von:</div>
                      <div className="flex flex-col gap-14">
                        <div>{spending.from}</div>
                        <div className="text-xs text-black/50">
                          Erstellt am:{" "}
                          {new Date(spending.updatedAt).toLocaleString(
                            "de-DE",
                            { timeZone: "Europe/Berlin" }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="justify-self-start w-full">
                      <div className="text-lg border-b">An:</div>
                      {spending.to.map((person, index) => (
                        <div key={index} className="truncate">
                          {person.name}
                        </div>
                      ))}
                    </div>
                    <div className="justify-self-start w-full">
                      <div className="text-lg border-b">Betrag:</div>
                      {spending.to.map((person, index) => (
                        <div className="text-left" key={index}>
                          {person.amount}€
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Spendings;
