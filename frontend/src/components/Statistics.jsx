import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

const Statistics = ({ personData, spendings }) => {
  const [lineXAxis, setLineXAxis] = useState({ data: [] });
  const [lineSeries, setLineSeries] = useState([]);
  const [pieSeries, setPieSeries] = useState([]);

  const convertLineData = () => {
    setLineXAxis([
      {
        data: spendings.map((spending) => {
          const date = new Date(spending.createdAt);
          return date;
        }),
        valueFormatter: (value) =>
          value.toLocaleDateString("de-DE", {
            timeZone: "Europe/Berlin",
          }),
        scaleType: "time",
      },
    ]);
    setLineSeries([
      {
        data: spendings.reduce((acc, curr, index) => {
          if (index === 0) {
            // acc.push(0);
            acc.push(curr.amount);
          } else {
            acc.push(acc[index - 1] + curr.amount); // Accumulate liabilities + expenditures
          }
          return acc;
        }, []),
      },
    ]);
    setPieSeries(
      personData.map((person) => ({
        value: Math.abs(person.liabilities.reduce((a, b) => a + b, 0)),
      }))
    );
    // setLineSeries(
    //   personData.map((person) => ({
    //     label: person.name,
    //     data: person.liabilities.reduce((acc, curr, index) => {
    //       if (index === 0) {
    //         acc.push(curr + person.expenditures[index]); // Add liabilities + expenditures for the first element
    //       } else {
    //         acc.push(acc[index - 1] + curr + person.expenditures[index]); // Accumulate liabilities + expenditures
    //       }
    //       return acc;
    //     }, []), // Initialize with an empty array
    //   }))
    // );
  };

  const pieChart = () => {
    return (
      <div className="">
        {pieSeries.length > 0 && (
          <PieChart
            height={210}
            width={210}
            series={[
              {
                data: pieSeries,
                innerRadius: 50,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -45,
                endAngle: 315,
                cx: 100,
                cy: 100,
              },
            ]}
          />
        )}
      </div>
    );
  };

  const lineChart = () => {
    return (
      <div className="flex flex-col mt-5">
        {lineSeries.length > 0 && (
          <LineChart
            xAxis={lineXAxis}
            series={lineSeries}
            height={400}
            margin={{
              top: 40,
              bottom: 20,
              left: 34,
              right: 2,
            }}
            className="w-full"
            grid={{ vertical: true, horizontal: true }}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    convertLineData();
  }, [personData, spendings]);

  useEffect(() => {
    console.log(lineXAxis, lineSeries);
    console.log(pieSeries);
  }, [lineSeries, lineXAxis]);

  return (
    <div>
      {/* <div>{lineChart()}</div> */}
      <div>
        <div className="flex flex-col justify-center">
          <div className="text-2xl flex justify-center">Ausgabenverteilung</div>
          <div className="flex justify-center">{pieChart()}</div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
