import React from "react";

const Summary = ({ personData }) => {
  return (
    <div className="grid grid-flow-col border rounded-lg overflow-auto">
      {personData.map((person) => (
        <div className="">
          <div>{person.name}</div>
          {person.liabilities.map((elmt, index) => (
            <div className="flex text-sm">
              <div className="text-green-500">
                {person.expenditures[index] === 0
                  ? "/"
                  : +person.expenditures[index].toFixed(2)}
              </div>
              <div className="text-red-500 text-right">
                {elmt === 0 ? "/" : +elmt.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Summary;
