import React from "react";

class Person {
  constructor(name, spendings) {
    this.name = name;
    this.liabilities = spendings.map((item) => {
      const person = item.to.find((person) => person.name === name);
      return person ? -person.amount : 0;
    });
    this.expenditures = spendings.map((item) => {
      return item.from === name ? item.amount : 0;
    });
    this.balance =
      this.liabilities.reduce((a, b) => a + b, 0) +
      this.expenditures.reduce((a, b) => a + b, 0);
  }
}

const SaldoCalc = ({ name, spendings }) => {
  const mySaldo = new Person(name, spendings);

  return <div>{mySaldo.balance.toFixed(2)} €</div>;
};

export default SaldoCalc;
