import { useEffect, useState } from "react";
import { createTheme, useTheme, ThemeProvider } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { mangoFusionPalette } from "@mui/x-charts/colorPalettes";

import NoSsr from "@mui/material/NoSsr";
import Popper from "@mui/material/Popper";
import {
  useAxisTooltip,
  useItemTooltip,
  useMouseTracker,
} from "@mui/x-charts/ChartsTooltip";
import { useDrawingArea, useSvgRef } from "@mui/x-charts/hooks";

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
    const skipEntryIndices = spendings.reduce((acc, spending, index) => {
      if (spending.isBalancingTransaction) {
        acc.push(index);
      }
      return acc;
    }, []);
    spendings = spendings.filter(
      (spending, index) => !skipEntryIndices.includes(index)
    );
    personData = personData.map((person) => ({
      ...person,
      liabilities: person.liabilities.filter(
        (item, index) => !skipEntryIndices.includes(index)
      ),
    }));
    setDataXAxis([
      {
        data: spendings,
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
      personData.map((person) => {
        const total_liablities = Math.abs(
          person.liabilities.reduce((a, b) => a + b, 0)
        );
        // const total_expenditures = Math.abs(
        //   person.expenditures.reduce((a, b) => a + b, 0)
        // );

        return {
          value: total_liablities,
          percent:
            total_liablities / spendings.reduce((a, b) => a + +b.amount, 0),
          label: person.name,
        };
      })
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
    if (addTotal) {
      const totalData = lineSeries.at(0)?.data.map((_, index) => {
        return lineSeries.reduce((sum, person) => sum + person.data[index], 0);
      });
      setLineSeries((prev) => [...prev, { label: "Gesamt", data: totalData }]);
    } else {
      setLineSeries((prev) => prev.filter((elmt) => elmt.label != "Gesamt"));
    }
  }, [addTotal]);

  const generateGetBoundingClientRect = (x = 0, y = 0) => {
    return () => ({
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x,
    });
  };

  const ItemTooltipFixedY = () => {
    const tooltipData = useItemTooltip();
    const mousePosition = useMouseTracker();
    const svgRef = useSvgRef(); // Get the ref of the <svg/> component.
    const drawingArea = useDrawingArea(); // Get the dimensions of the chart inside the <svg/>.

    if (!tooltipData || !mousePosition) {
      // No data to display
      return null;
    }

    const tooltipPosition = {
      ...mousePosition,
      // Add the y-coordinate of the <svg/> to the to margin between the <svg/> and the drawing area
      y: svgRef.current.getBoundingClientRect().top + drawingArea.top - 40,
    };

    // console.log(mousePosition);

    const virtualElement = (tooltipPosition) => {
      return {
        getBoundingClientRect: generateGetBoundingClientRect(
          tooltipPosition.x,
          tooltipPosition.y
        ),
      };
    };

    return (
      <NoSsr>
        <Popper
          sx={{
            pointerEvents: "none",
            zIndex: (theme) => theme.zIndex.modal,
          }}
          open
          placement="top"
          anchorEl={virtualElement(tooltipPosition)}
        >
          <div className="border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-card dark:bg-dark-card">
            <div className="flex gap-2 p-3 items-center">
              <div
                style={{ backgroundColor: tooltipData.color }}
                className={`w-3 h-3 rounded-full`}
              ></div>
              <div className="w-20 truncate">{tooltipData.label}</div>
              <div>
                <div className="text-right flex justify-end">
                  {tooltipData.formattedValue}
                  <div className="px-1.5">€</div>
                </div>
                <div className="text-right flex justify-end">
                  {(tooltipData.value.percent * 100).toFixed(2)}
                  <div className="px-1">%</div>
                </div>
              </div>
            </div>
          </div>
        </Popper>
      </NoSsr>
    );
  };

  const AxisTooltipFixedY = () => {
    const tooltipData = useAxisTooltip();
    const mousePosition = useMouseTracker();
    const svgRef = useSvgRef(); // Get the ref of the <svg/> component.
    const drawingArea = useDrawingArea(); // Get the dimensions of the chart inside the <svg/>.

    if (!tooltipData || !mousePosition) {
      // No data to display
      return null;
    }

    const tooltipPosition = {
      ...mousePosition,
      // Add the y-coordinate of the <svg/> to the to margin between the <svg/> and the drawing area
      y: svgRef.current.getBoundingClientRect().top + drawingArea.top,
    };

    // console.log(mousePosition);

    const virtualElement = (tooltipPosition) => {
      return {
        getBoundingClientRect: generateGetBoundingClientRect(
          tooltipPosition.x,
          tooltipPosition.y
        ),
      };
    };

    return (
      <NoSsr>
        <Popper
          sx={{
            pointerEvents: "none",
            zIndex: (theme) => theme.zIndex.modal,
          }}
          open
          placement="top"
          anchorEl={virtualElement(tooltipPosition)}
        >
          <div className="border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-card dark:bg-dark-card">
            <div className="py-1">
              <div className="text-lg px-3 ">{tooltipData.axisValue.title}</div>
              <div className="text-md px-3 font-light">
                {new Date(tooltipData.axisValue.createdAt).toLocaleString(
                  "de-DE",
                  {
                    timeZone: "Europe/Berlin",
                  }
                )}
              </div>
            </div>
            <div className="flex flex-col py-1">
              {tooltipData.seriesItems?.map((elmt, index) => (
                <div key={index} className="flex gap-2 px-3 items-center">
                  <div
                    style={{ backgroundColor: elmt.color }}
                    className={`w-3 h-3 rounded-full`}
                  ></div>
                  <div className="w-20 truncate">{elmt.formattedLabel}</div>
                  <div className="flex justify-self-end">
                    {elmt.formattedValue} €
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Popper>
      </NoSsr>
    );
  };

  const pieChart = () => {
    return (
      pieSeries && (
        <ThemeProvider theme={newTheme}>
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
            tooltip={{
              trigger: "item",
            }}
            slots={{ popper: ItemTooltipFixedY }}
          />
        </ThemeProvider>
      )
    );
  };

  const barChart = () => {
    return (
      barSeries && (
        <ThemeProvider theme={newTheme}>
          <BarChart
            xAxis={dataXAxis}
            series={barSeries}
            borderRadius={8}
            margin={{
              top: 66,
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
            colors={mangoFusionPalette}
            slots={{ popper: AxisTooltipFixedY }}
          />
        </ThemeProvider>
      )
    );
  };

  const lineChart = () => {
    return (
      lineSeries && (
        <ThemeProvider theme={newTheme}>
          <LineChart
            xAxis={dataXAxis}
            series={lineSeries}
            margin={{
              top: 66,
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
            slots={{ popper: AxisTooltipFixedY }}
          />
        </ThemeProvider>
      )
    );
  };

  useEffect(() => {
    convertLineData();
  }, [personData, spendings]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
        <div className="flex text-xl justify-center">
          Aufsummierter Verbrauch
        </div>
        <div className="flex h-64">{pieChart()}</div>
      </div>
      <div className="flex flex-col rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
        <div className="flex text-xl justify-center">Anteilige Ausgaben</div>
        <div className="flex w-full h-96">{barChart()}</div>
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
        <div className="flex w-full h-96">{lineChart()}</div>
      </div>
    </div>
  );
};

export default Statistics;
