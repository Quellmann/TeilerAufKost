import React from "react";

import NewSpending from "../pages/NewSpending";
import NewPerson from "../pages/NewPerson";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router-dom";

const AddDetails = ({ emblaApi, setRefresh }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const renderType = () => {
    switch (searchParams.get("type")) {
      case "spending":
        return (
          <NewSpending
            emblaApi={emblaApi}
            setRefresh={setRefresh}
          ></NewSpending>
        );
      case "transaction":
        return (
          <NewSpending
            emblaApi={emblaApi}
            setRefresh={setRefresh}
          ></NewSpending>
        );
      case "person":
        return (
          <NewPerson emblaApi={emblaApi} setRefresh={setRefresh}></NewPerson>
        );
      case "":
        return <></>;
    }
  };
  return (
    <div className="m-1 flex-col flex grow">
      <div>
        <button
          onClick={() => {
            emblaApi.scrollTo(1);
            setSearchParams({ groupId: searchParams.get("groupId") });
          }}
          className="flex items-center p-1 border rounded-lg mb-5 mt-6"
        >
          <ArrowUturnLeftIcon className="size-6"></ArrowUturnLeftIcon>
          <div className="ml-3">Zurück</div>
        </button>
      </div>
      {renderType()}
    </div>
  );
};

export default AddDetails;
