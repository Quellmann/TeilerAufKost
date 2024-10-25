import React from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

const Summary = ({ personData, emblaApi }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFocus = (index) => {
    setSearchParams({ groupId: searchParams.get("groupId"), focus: index });
    emblaApi.scrollTo(2);
  };

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
        <tbody className="divide-y">
          {personData.map((person, personIndex) => (
            <tr key={personIndex}>
              <td className="p-2">{person.name}</td>
              <td className="p-2">
                {person.expenditures.map((expenditure, index) => (
                  <div key={index}>
                    <div
                      onClick={() => handleFocus(index)}
                      className="text-green-500 text-sm"
                    >
                      {expenditure === 0 ? "" : expenditure.toFixed(2)}
                    </div>
                    {/* <Link
                      to={`${location.pathname}/spendings?${new URLSearchParams(
                        {
                          focus: index,
                        }
                      )}`}
                      className="text-green-500 text-sm"
                    >
                      {expenditure === 0 ? "" : expenditure.toFixed(2)}
                    </Link> */}
                  </div>
                ))}
              </td>
              <td className="p-2">
                {person.liabilities.map((liability, index) => (
                  <div key={index}>
                    <Link
                      to={`${location.pathname}/spendings?${new URLSearchParams(
                        {
                          focus: index,
                        }
                      )}`}
                      className="text-red-500 text-sm"
                    >
                      {liability === 0 ? "" : liability.toFixed(2)}
                    </Link>
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
