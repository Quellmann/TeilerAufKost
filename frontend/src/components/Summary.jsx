import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const Summary = ({ personData, emblaApi }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFocus = (index) => {
    setSearchParams({ groupId: searchParams.get("groupId"), focus: index });
    emblaApi.scrollTo(2);
  };

  return (
    <div className="border rounded-lg overflow-auto m-0.5">
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 w-1/3">Name</th>
            <th className="text-left p-2 w-1/3">Bezahlt</th>
            <th className="text-left p-2 w-1/3">Verbraucht</th>
          </tr>
        </thead>
        <tbody className="">
          {personData.map((person, personIndex) => (
            <React.Fragment key={personIndex}>
              <tr className="border-t">
                <td className="p-2">{person.name}</td>
                <td className="p-2">
                  <div>
                    {person.expenditures.map((expenditure, index) => (
                      <div key={index}>
                        <div
                          onClick={() => handleFocus(index)}
                          className="text-green-500 text-sm cursor-pointer"
                        >
                          {expenditure === 0 ? "" : expenditure.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-2">
                  <div>
                    {person.liabilities.map((liability, index) => (
                      <div key={index}>
                        <div
                          onClick={() => handleFocus(index)}
                          className="text-red-500 text-sm cursor-pointer"
                        >
                          {liability === 0 ? "" : liability.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-t border-dashed">
                <td className="px-2 text-sm text-black/30">Summe:</td>
                <td className="px-2">
                  <div className="text-sm text-green-500">
                    {person.expenditures.reduce((a, b) => a + b, 0)
                      ? person.expenditures
                          .reduce((a, b) => a + b, 0)
                          .toFixed(2)
                      : ""}
                  </div>
                </td>
                <td className="px-2">
                  <div className="text-sm text-red-500">
                    {person.liabilities.reduce((a, b) => a + b, 0)
                      ? person.liabilities.reduce((a, b) => a + b, 0).toFixed(2)
                      : ""}
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Summary;
