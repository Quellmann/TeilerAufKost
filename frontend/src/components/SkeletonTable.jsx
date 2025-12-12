import React from "react";

const SkeletonTable = ({ rows = 4 }) => (
  <div className="overflow-auto">
    <table className="min-w-full">
      <thead>
        <tr className="text-left">
          <th className="skeleton h-6 w-40 rounded"></th>
          <th className="skeleton h-6 w-24 rounded"></th>
          <th className="skeleton h-6 w-24 rounded"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-light-border dark:divide-dark-border">
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="p-2">
            <td className="py-3">
              <div className="skeleton h-5 w-48 rounded"></div>
            </td>
            <td className="py-3">
              <div className="skeleton h-5 w-20 rounded"></div>
            </td>
            <td className="py-3">
              <div className="skeleton h-5 w-20 rounded"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SkeletonTable;
