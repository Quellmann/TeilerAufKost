import React from "react";

const Summary = ({ personData }) => {
  return (
    <div className="border rounded-lg overflow-auto">
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 w-1/3">Name</th>
            <th className="text-left p-2 w-1/3">Bezahlt</th>
            <th className="text-left p-2 w-1/3">Verbraucht</th>
          </tr>
        </thead>
        <tbody>
          {personData.map((person, personIndex) => (
            <tr key={personIndex} className="border-b">
              <td className="p-2">{person.name}</td>
              <td className="p-2">
                {person.expenditures.map((expenditure, index) => (
                  <div key={index} className="text-green-500 text-sm">
                    {expenditure === 0 ? "" : expenditure.toFixed(2)}
                  </div>
                ))}
              </td>
              <td className="p-2">
                {person.liabilities.map((liability, index) => (
                  <div key={index} className="text-red-500 text-sm">
                    {liability === 0 ? "" : liability.toFixed(2)}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Summary;
