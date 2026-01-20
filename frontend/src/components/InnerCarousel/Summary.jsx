import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const Summary = ({ saldoData, emblaApi }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFocus = (index) => {
    setSearchParams({ groupId: searchParams.get("groupId"), focus: index });
    emblaApi.scrollTo(2);
  };

  return (
    <div className="rounded-lg overflow-auto bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="border-b border-light-border dark:border-dark-border">
            <th className="text-left p-2 w-1/3">Name</th>
            <th className="text-left p-2 w-1/3">Bezahlt</th>
            <th className="text-left p-2 w-1/3">Verbraucht</th>
          </tr>
        </thead>
        <tbody className="">
          {saldoData.map((saldo, saldoIndex) => (
            <React.Fragment key={saldoIndex}>
              <tr className="border-t border-light-border dark:border-dark-border">
                <td className="p-2">{saldo.name}</td>
                <td className="p-2">
                  <div>
                    {saldo.expenditures.map((expenditure, index) => (
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
                    {saldo.liabilities.map((liability, index) => (
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
              <tr className="border-t border-dashed border-light-border dark:border-dark-border">
                <td className="px-2 text-sm">Summe:</td>
                <td className="px-2">
                  <div className="text-sm text-green-500">
                    {saldo.expenditures.reduce((a, b) => a + b, 0)
                      ? saldo.expenditures.reduce((a, b) => a + b, 0).toFixed(2)
                      : ""}
                  </div>
                </td>
                <td className="px-2">
                  <div className="text-sm text-red-500">
                    {saldo.liabilities.reduce((a, b) => a + b, 0)
                      ? saldo.liabilities.reduce((a, b) => a + b, 0).toFixed(2)
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
