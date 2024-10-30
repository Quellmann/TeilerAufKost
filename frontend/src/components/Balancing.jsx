import { ArrowRightIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";

const Balancing = ({ personData }) => {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const [setSidebarGroups, refresh, emblaApi] = useOutletContext();

  const balancingCalculation = () => {
    let senders = personData
      .filter((person) => person.balance() < 0)
      .sort((a, b) => b.balance() - a.balance())
      .map((entry) => ({ ...entry, balance: entry.balance() }));
    let receivers = personData
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
    <div className="border rounded-lg overflow-auto m-0.5">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Von</th>
            <th className="text-left p-2">An</th>
            <th className="text-left p-2">Betrag</th>
            <th className="text-center p-2">Begleichen</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {balancingCalculation().map((balancing, personIndex) => (
            <tr key={personIndex}>
              <td className="p-2">{balancing.from}</td>
              <td className="p-2">{balancing.to}</td>
              <td className="p-2">{balancing.amount.toFixed(2)} €</td>
              <td className="p-1">
                <div className="flex justify-center">
                  <Link
                    to={`/?groupId=${groupId}&${new URLSearchParams({
                      type: "transaction",
                      amount: balancing.amount.toFixed(2),
                      from: balancing.from,
                      to: balancing.to,
                    })}`}
                    className="flex justify-center rounded-lg px-4 py-1 border hover:bg-green-400"
                    onClick={() => emblaApi.scrollTo(2)}
                  >
                    <BanknotesIcon className="w-6"></BanknotesIcon>
                    {/* <ArrowRightIcon className="w-6"></ArrowRightIcon> */}
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Balancing;
