const SkeletonAdminTable = () => (
  <div className="overflow-auto">
    <div></div>
    <div className="divide-y divide-light-border dark:divide-dark-border">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="py-2 flex justify-between">
          <div className="skeleton h-5 w-1/2 rounded"></div>
          <div className="skeleton h-5 w-1/5 rounded"></div>
          <div className="skeleton h-5 w-1/6 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonAdminTable;
