import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const Statistics = ({ personData, spendings }) => {
  const people = [
    ...new Set(
      spendings.flatMap((item) => item.to.map((person) => person.name))
    ),
  ];

  // Function to format spending data for each person
  const formatSpendingData = () => {
    const formattedData = spendings.map((item) => {
      const date = new Date(item.createdAt).toLocaleDateString("de-DE", {
        timeZone: "Europe/Berlin",
      });
      const personData = item.to.reduce(
        (acc, person) => {
          acc[person.name] = person.amount; // Add amount for each person
          return acc;
        },
        { date }
      ); // Add date to each entry
      return personData;
    });

    return formattedData;
  };

  const dataset = formatSpendingData();

  return (
    // <LineChart
    //   xAxis={[
    //     {
    //       dataKey: "date", // X-axis is the date
    //       valueFormatter: (value) => value.toString(),
    //       scaleType: "time", // Treat the x-axis as a time scale
    //     },
    //   ]}
    //   series={people.map((person) => ({
    //     dataKey: person, // Each person has their own dataKey
    //     label: person, // The label is the person's name
    //     showMark: false,
    //   }))}
    //   dataset={dataset}
    //   height={300}
    //   margin={{ top: 5 }}
    // />
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
      ]}
      height={300}
      className="w-full"
    />
  );
};

export default Statistics;
