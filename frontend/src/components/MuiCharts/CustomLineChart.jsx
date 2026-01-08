import { BarPlot, LinePlot } from "@mui/x-charts";
import { CustomAxisTooltip } from "./CustomAxisTooltip";
import { mangoFusionPalette } from "@mui/x-charts/colorPalettes";
import { ChartDataProvider } from "@mui/x-charts/ChartDataProvider";
import { ChartsLegend } from "@mui/x-charts/ChartsLegend";
import { ChartsSurface } from "@mui/x-charts/ChartsSurface";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsClipPath } from "@mui/x-charts/ChartsClipPath";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ChartsAxisHighlight } from "@mui/x-charts/ChartsAxisHighlight";
import { ChartsTooltipContainer } from "@mui/x-charts/ChartsTooltip";
import { useId } from "react";

const CustomLineChart = ({ xAxis, series }) => {
  const id = useId();
  const clipPathId = `${id}-clip-path`;

  return (
    <ChartDataProvider
      series={series}
      xAxis={xAxis}
      margin={{
        top: 20,
        bottom: 10,
        left: 0,
        right: 30,
      }}
      colors={mangoFusionPalette}
    >
      <ChartsSurface>
        <ChartsClipPath id={clipPathId} />
        <g clipPath={`url(#${clipPathId})`}></g>
        <ChartsXAxis />
        <ChartsYAxis />
        <LinePlot />
        <ChartsAxisHighlight x="line" />
        <ChartsTooltipContainer trigger="axis">
          <CustomAxisTooltip />
        </ChartsTooltipContainer>
      </ChartsSurface>
      <div className="max-w-[90%] m-auto">
        <ChartsLegend
          slotProps={{
            legend: {
              direction: "horizontal",
              sx: {
                display: "flex",
                justifyContent: "start",
                overflow: "auto",
                height: "45px",
                flexWrap: "nowrap",
                userSelect: "none",
                margin: "0",
              },
            },
          }}
        />
      </div>
    </ChartDataProvider>
  );
};

export default CustomLineChart;
