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
    <div className="mt-6 p-2 flex-col flex grow border border-light-border dark:border-dark-border rounded-lg">
      <div>
        <button
          onClick={() => {
            emblaApi.scrollTo(1);
            setSearchParams({ groupId: searchParams.get("groupId") });
          }}
          className="flex items-center p-1 rounded-lg mb-5 border border-light-border dark:border-dark-border"
        >
          <ArrowUturnLeftIcon className="size-5"></ArrowUturnLeftIcon>
          <div className="mx-2">Zurück</div>
        </button>
      </div>
      {renderType()}
    </div>
  );
};

export default AddDetails;
