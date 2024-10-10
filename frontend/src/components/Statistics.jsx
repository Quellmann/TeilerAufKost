import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const Statistics = ({ personData, spendings }) => {
  const [lineXAxis, setLineXAxis] = useState({ data: [] });
  const [lineSeries, setLineSeries] = useState([]);

  // Function to format spending data for each person
  const formatSpendingData = () => {
    const formattedData = spendings.map((spending) => {
      const date = new Date(spending.createdAt).toLocaleDateString("de-DE", {
        timeZone: "Europe/Berlin",
      });
      const dataset = personData.reduce(
        (acc, person) => {
          acc[person.name] =
            parseFloat(person.liabilities) + parseFloat(person.expenditures); // Add amount for each person
          return acc;
        },
        { date }
      ); // Add date to each entry
      return dataset;
    });

    return formattedData;
  };

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
    setLineSeries(
      personData.map((person) => ({
        label: person.name,
        data: person.liabilities.reduce((acc, curr, index) => {
          if (index === 0) {
            acc.push(curr + person.expenditures[index]); // Add liabilities + expenditures for the first element
          } else {
            acc.push(acc[index - 1] + curr + person.expenditures[index]); // Accumulate liabilities + expenditures
          }
          return acc;
        }, []), // Initialize with an empty array
      }))
    );
  };

  useEffect(() => {
    convertLineData();
  }, [personData, spendings]);

  useEffect(() => {
    console.log(lineXAxis, lineSeries);
  }, [lineSeries, lineXAxis]);

  return (
    lineSeries.length > 0 && (
      <LineChart
        xAxis={lineXAxis}
        series={lineSeries}
        height={400}
        className="w-full"
      />
    )
  );
};

export default Statistics;
