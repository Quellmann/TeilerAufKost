import { useItemTooltip } from "@mui/x-charts/ChartsTooltip";

export function CustomItemTooltip() {
  const tooltipData = useItemTooltip();
  if (!tooltipData) {
    return null;
  }
  return (
    <div className="border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-card dark:bg-dark-card">
      <div className="flex flex-col py-3">
        <div className="flex gap-2 px-3 items-center">
          <div
            style={{ backgroundColor: tooltipData.color }}
            className="w-3 h-3 rounded-full"
          />
          <div className="w-20 truncate">{tooltipData.label}</div>
          <div className="flex flex-col items-end">
            <div className="mr-1">
              {parseFloat(tooltipData.value.value)} €
              {/* {parseFloat(tooltipData.value.value).toFixed(2)} € */}
            </div>
            <div>
              {parseFloat(tooltipData.value.percent * 100).toFixed(2)} %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
