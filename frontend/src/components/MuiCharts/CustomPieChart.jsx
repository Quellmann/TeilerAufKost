import { PiePlot } from "@mui/x-charts";
import { CustomItemTooltip } from "./CustomItemTooltip";
import { mangoFusionPalette } from "@mui/x-charts/colorPalettes";
import { ChartDataProvider } from "@mui/x-charts/ChartDataProvider";
import { ChartsLegend } from "@mui/x-charts/ChartsLegend";
import { ChartsSurface } from "@mui/x-charts/ChartsSurface";
import { ChartsClipPath } from "@mui/x-charts/ChartsClipPath";
import { ChartsTooltipContainer } from "@mui/x-charts/ChartsTooltip";
import { useId } from "react";

const CustomPieChart = ({ series }) => {
  const id = useId();
  const clipPathId = `${id}-clip-path`;

  return (
    <ChartDataProvider
      series={[
        {
          type: "pie",
          data: series,
          innerRadius: 50,
          outerRadius: 100,
          paddingAngle: 2,
          cornerRadius: 5,
          startAngle: -45,
          endAngle: 315,
        },
      ]}
      margin={{
        top: 20,
        bottom: 0,
        left: 0,
        right: 50,
      }}
      colors={mangoFusionPalette}
    >
      <ChartsSurface>
        <ChartsClipPath id={clipPathId} />
        <g clipPath={`url(#${clipPathId})`}></g>
        <PiePlot />
        <ChartsTooltipContainer trigger="item">
          <CustomItemTooltip />
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

export default CustomPieChart;
