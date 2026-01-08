import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import CustomLineChart from "./MuiCharts/CustomLineChart";
import CustomBarChart from "./MuiCharts/CustomBarChart";
import CustomPieChart from "./MuiCharts/CustomPieChart";

import { CheckIcon } from "@heroicons/react/24/outline";

const Statistics = ({ personData, spendings }) => {
  const [dataXAxis, setDataXAxis] = useState([]);
  const [lineSeries, setLineSeries] = useState([]);
  const [pieSeries, setPieSeries] = useState([]);
  const [barSeries, setBarSeries] = useState([]);
  const [addTotal, setAddTotal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const newTheme = createTheme({
    palette: { mode: darkMode ? "dark" : "light" },
  });

  useEffect(() => {
    // Initialize from current document class (handles default dark mode)
    if (typeof document !== "undefined") {
      setDarkMode(document.documentElement.classList.contains("dark"));
    }

    // Observe changes to the `class` attribute to update theme dynamically
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const convertLineData = () => {
    const skipBalancingTransactions = spendings.reduce(
      (acc, spending, index) => {
        if (spending.isBalancingTransaction) {
          acc.push(index);
        }
        return acc;
      },
      []
    );
    const filteredSpendings = spendings.filter(
      (spending, index) => !skipBalancingTransactions.includes(index)
    );
    const filteredPersonData = personData.map((person) => ({
      ...person,
      liabilities: person.liabilities.filter(
        (item, index) => !skipBalancingTransactions.includes(index)
      ),
    }));
    setDataXAxis([
      {
        data: filteredSpendings,
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
      filteredPersonData.map((person) => ({
        type: "line",
        labelMarkType: "circle",
        label: person.name,
        data: person.liabilities.reduce((acc, curr, index) => {
          if (index === 0) {
            acc.push(Math.abs(curr));
          } else {
            acc.push(acc[index - 1] + Math.abs(curr));
          }
          return acc;
        }, []),
      }))
    );

    setPieSeries(
      filteredPersonData
        .map((person) => {
          const total_liabilities = Math.abs(
            person.liabilities.reduce((a, b) => a + b, 0)
          );

          return {
            value: parseFloat(total_liabilities).toFixed(2),
            percent:
              total_liabilities /
              filteredSpendings.reduce((a, b) => a + +b.amount, 0),
            label: person.name,
          };
        })
        .filter((elmt) => elmt.value != 0)
    );

    setBarSeries(
      filteredPersonData.map((person) => ({
        type: "bar",
        labelMarkType: "circle",
        label: person.name,
        data: person.liabilities.map((elmt) => Math.abs(elmt)),
        stack: "total",
      }))
    );
  };

  useEffect(() => {
    if (addTotal) {
      const totalData = lineSeries.at(0)?.data.map((_, index) => {
        return lineSeries.reduce((sum, person) => sum + person.data[index], 0);
      });
      setLineSeries((prev) => [
        ...prev,
        {
          label: "Gesamt",
          data: totalData,
          labelMarkType: "circle",
          type: "line",
        },
      ]);
    } else {
      setLineSeries((prev) => prev.filter((elmt) => elmt.label != "Gesamt"));
    }
  }, [addTotal]);

  useEffect(() => {
    convertLineData();
  }, [personData, spendings]);

  return (
    <div className="flex flex-col gap-5">
      <ThemeProvider theme={newTheme}>
        <div className="flex flex-col rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
          <div className="flex text-xl justify-center">
            Aufsummierter Verbrauch
          </div>
          <div className="flex flex-col w-full h-[300px]">
            <CustomPieChart series={pieSeries}></CustomPieChart>
          </div>
        </div>
        <div className="flex flex-col rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
          <div className="flex text-xl justify-center">Anteilige Ausgaben</div>
          <div className="flex flex-col w-full h-96">
            <CustomBarChart
              xAxis={dataXAxis}
              series={barSeries}
            ></CustomBarChart>
          </div>
        </div>
        <div className="flex flex-col rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border relative">
          <div className="flex text-xl justify-center -translate-x-5 sm:translate-x-5">
            Kummulierte Ausgaben
          </div>
          <div className="absolute top-1 right-1 flex items-center">
            <div className="text-xs">Gesamt</div>
            <div
              onClick={() => setAddTotal((prev) => !prev)}
              className={`ml-1 cursor-pointer w-6 h-6 rounded-md border border-light-border dark:border-dark-border`}
            >
              {" "}
              {addTotal && <CheckIcon></CheckIcon>}
            </div>
          </div>
          <div className="flex flex-col w-full h-96">
            <CustomLineChart
              xAxis={dataXAxis}
              series={lineSeries}
            ></CustomLineChart>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default Statistics;
