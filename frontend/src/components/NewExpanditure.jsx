import React from "react";

import NewSpending from "../pages/NewSpending";
import NewTransaction from "../pages/NewTransaction";
import NewPerson from "../pages/NewPerson";

const NewExpanditure = ({ addType, emblaApi }) => {
  const renderType = () => {
    switch (addType) {
      case "spending":
        return <NewSpending emblaApi={emblaApi}></NewSpending>;
      case "transaction":
        return <NewTransaction emblaApi={emblaApi}></NewTransaction>;
      case "person":
        return <NewPerson emblaApi={emblaApi}></NewPerson>;
      case "":
        return <div>Bad input</div>;
    }
  };
  return renderType();
};

export default NewExpanditure;
