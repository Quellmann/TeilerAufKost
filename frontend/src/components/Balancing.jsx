import React, { useState } from "react";
import { Link } from "react-router-dom";

const Balancing = ({ personData }) => {
  const [localCopy, setLocalCopy] = useState(personData);

  const balancingCalculation = () => {
    let senders = localCopy
      .filter((person) => person.balance() < 0)
      .sort((a, b) => b.balance() - a.balance())
      .map((entry) => ({ ...entry, balance: entry.balance() }));
    let receivers = localCopy
      .filter((person) => person.balance() > 0)
      .sort((a, b) => a.balance() - b.balance())
      .map((entry) => ({ ...entry, balance: entry.balance() }));

    let result = [];
    let i = 0;

    while (receivers.length > 0) {
      let currentReceiver = receivers.pop();
      let currentBalance = currentReceiver.balance;
      while (currentBalance > 0.001 && senders.length > 0) {
        i += 1;
        let currentSender = senders.pop();
        let senderBalanceRemaining = currentSender.balance;
        if (currentBalance + senderBalanceRemaining < 0) {
          senderBalanceRemaining += currentBalance;
          result.push({
            from: currentSender.name,
            to: currentReceiver.name,
            amount: currentBalance,
          });
          currentSender.balance = senderBalanceRemaining;
          senders.push(currentSender);
          break;
        } else {
          currentBalance += senderBalanceRemaining;
          result.push({
            from: currentSender.name,
            to: currentReceiver.name,
            amount: -senderBalanceRemaining,
          });
        }
        if (i > 1000) {
          console.log("iterations bound");
          return [];
        }
      }
    }
    return result;
  };

  return (
    <div className="border rounded-lg divide-y">
      {balancingCalculation().map((balancing, index) => (
        <Link
          to={`newTransaction?${new URLSearchParams({
            amount: balancing.amount.toFixed(2),
            from: balancing.from,
            to: balancing.to,
          })}`}
          key={index}
          className="grid grid-cols-4 justify-between p-2 hover:bg-slate-200"
        >
          <div>Von: {balancing.from}</div>
          <div>An: {balancing.to}</div>
          <div>{balancing.amount.toFixed(2)} €</div>
          <div>bezahlen</div>
        </Link>
      ))}
    </div>
  );
};

export default Balancing;
