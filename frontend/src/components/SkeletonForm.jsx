import React from "react";

const SkeletonForm = () => (
  <div className="">
    <div className="skeleton h-[57px] w-full rounded-lg mt-[85px]"></div>
    <div className="mt-5 skeleton h-12 w-2/5 mx-auto rounded-lg"></div>
    <div className="mt-3 skeleton h-12 w-2/5 mx-auto rounded-lg"></div>
    <div className="mt-14 skeleton h-40 w-full rounded-lg">
      <div className="border-b pt-11 border-light-border dark:border-dark-border"></div>
    </div>
    <div className="mt-5 skeleton h-48 w-full rounded-lg">
      <div className="border-b mt-11 border-light-border dark:border-dark-border"></div>
    </div>
    <div className="mt-5 skeleton h-10 w-[189px] mx-auto rounded-lg"></div>
  </div>
);

export default SkeletonForm;
