import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  blueberryTwilightPalette,
  mangoFusionPalette,
  cheerfulFiestaPalette,
} from "@mui/x-charts/colorPalettes";

const Statistics = ({ personData, spendings }) => {
  const [lineXAxis, setLineXAxis] = useState({ data: [] });
  const [lineSeries, setLineSeries] = useState([]);
  const [pieSeries, setPieSeries] = useState([]);
  const [barSeries, setBarSeries] = useState([]);

  const convertLineData = () => {
    setLineXAxis([
      {
        // data: spendings.map((spending) => spending.title),
        data: spendings,
        // data: spendings.map((spending) => {
        //   const date = new Date(spending.createdAt);
        //   return date;
        // }),
        // valueFormatter: (value) =>
        //   value.toLocaleDateString("de-DE", {
        //     timeZone: "Europe/Berlin",
        //   }),
        valueFormatter: (spending) =>
          new Date(spending.createdAt).toLocaleDateString("de-DE", {
            timeZone: "Europe/Berlin",
          }) +
          "\n" +
          spending.title,
        scaleType: "band",
      },
    ]);

    setLineSeries(
      personData.map((person) => ({
        label: person.name,
        data: person.liabilities.reduce((acc, curr, index) => {
          if (index === 0) {
            acc.push(Math.abs(curr)); // Add liabilities + expenditures for the first element
          } else {
            acc.push(acc[index - 1] + Math.abs(curr)); // Accumulate liabilities + expenditures
          }
          return acc;
        }, []),
      }))
    );

    setPieSeries(
      personData.map((person) => ({
        value: Math.abs(person.liabilities.reduce((a, b) => a + b, 0)),
        label: person.name,
      }))
    );

    setBarSeries(
      personData.map((person) => ({
        label: person.name,
        data: person.liabilities.map((elmt) => Math.abs(elmt)),
        stack: "total",
      }))
    );
  };

  useEffect(() => {
    if (lineSeries.length === personData.length) {
      const totalData = lineSeries.at(0)?.data.map((_, index) => {
        return lineSeries.reduce((sum, person) => sum + person.data[index], 0);
      });
      setLineSeries((prev) => [...prev, { label: "Gesamt", data: totalData }]);
    }
  }, [lineSeries]);

  const barChart = () => {
    return (
      barSeries && (
        <BarChart
          xAxis={lineXAxis}
          series={barSeries}
          borderRadius={8}
          slotProps={{
            legend: {
              direction: "row",
              itemMarkWidth: 18,
              itemMarkHeight: 3,
              markGap: 5,
              itemGap: 10,
            },
          }}
          colors={mangoFusionPalette}
        />
      )
    );
  };

  const pieChart = () => {
    return (
      pieSeries && (
        <PieChart
          series={[
            {
              data: pieSeries,
              innerRadius: 50,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 5,
              startAngle: -45,
              endAngle: 315,
            },
          ]}
          slotProps={{
            legend: {
              direction: "column",
              position: {
                vertical: "middle",
                horizontal: "right",
              },
              itemMarkWidth: 18,
              itemMarkHeight: 3,
              markGap: 5,
              itemGap: 10,
            },
          }}
          colors={mangoFusionPalette}
        />
      )
    );
  };

  const lineChart = () => {
    return (
      lineSeries && (
        <LineChart
          xAxis={lineXAxis}
          series={lineSeries}
          margin={{
            top: 36,
            bottom: 36,
            left: 36,
            right: 36,
          }}
          slotProps={{
            legend: {
              direction: "row",
              itemMarkWidth: 18,
              itemMarkHeight: 3,
              markGap: 5,
              itemGap: 10,
            },
          }}
          grid={{ vertical: false, horizontal: true }}
          colors={mangoFusionPalette}
        />
      )
    );
  };

  useEffect(() => {
    convertLineData();
  }, [personData, spendings]);

  useEffect(() => {
    // console.log(lineSeries);
    // console.log(barSeries);
  }, [lineSeries, lineXAxis]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col border rounded-lg">
        <div className="flex text-xl justify-center">
          Aufsummierte Ausgabenverteilung
        </div>
        <div className="flex h-64">{pieChart()}</div>
      </div>
      <div className="flex flex-col border rounded-lg">
        <div className="flex text-xl justify-center">Anteilige Ausgaben</div>
        <div className="flex w-full h-96">{barChart()}</div>
      </div>
      <div className="flex flex-col border rounded-lg">
        <div className="flex text-xl justify-center">Kummulierte Ausgaben</div>
        <div className="flex w-full h-96">{lineChart()}</div>
      </div>
    </div>
  );
};

export default Statistics;
