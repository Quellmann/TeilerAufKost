import React from "react";

const SkeletonForm = () => (
  <div className="space-y-4">
    <div className="skeleton h-10 w-1/2 rounded"></div>
    <div className="skeleton h-10 w-full rounded"></div>
    <div className="skeleton h-10 w-full rounded"></div>
    <div className="flex gap-2">
      <div className="skeleton h-10 w-32 rounded"></div>
      <div className="skeleton h-10 w-32 rounded"></div>
    </div>
    <div className="skeleton h-36 w-full rounded"></div>
  </div>
);

export default SkeletonForm;
