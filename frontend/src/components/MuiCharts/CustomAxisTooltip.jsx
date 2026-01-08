import { useAxesTooltip } from "@mui/x-charts/ChartsTooltip";

export function CustomAxisTooltip() {
  const tooltipData = useAxesTooltip();
  const firstAxisData = tooltipData?.[0];

  if (!firstAxisData) {
    return null;
  }
  return (
    <div className="border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-card dark:bg-dark-card">
      <div className="py-1">
        <div className="text-lg px-3">{firstAxisData.axisValue.title}</div>
        <div className="text-md px-3 font-light">
          {new Date(firstAxisData.axisValue.createdAt).toLocaleString("de-DE", {
            timeZone: "Europe/Berlin",
          })}
        </div>
      </div>
      <div className="flex flex-col py-1">
        {firstAxisData.seriesItems?.map((elmt, index) => (
          <div key={index} className="flex gap-2 px-3 items-center">
            <div
              style={{ backgroundColor: elmt.color }}
              className="w-3 h-3 rounded-full"
            />
            <div className="w-20 truncate">{elmt.formattedLabel}</div>
            <div className="flex justify-self-end">{elmt.formattedValue} €</div>
          </div>
        ))}
      </div>
    </div>
  );
}
