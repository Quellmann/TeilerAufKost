import React from "react";

const MemberRow = () => (
  <div className="flex justify-between items-center p-2">
    <div className="flex items-center gap-3">
      <div className="skeleton h-7 w-44 rounded-lg"></div>
    </div>
    <div className="skeleton h-7 w-14 rounded-lg"></div>
  </div>
);

const SkeletonOverview = () => {
  return (
    <div className="rounded-lg border border-light-border dark:border-dark-border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border">
        <div className="skeleton h-[75px] w-full rounded-t-lg"></div>
      </div>
      {/* Saldo rows */}
      <div className="mx-2 mt-11 rounded-lg divide-y divide-light-border dark:divide-dark-border bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
        <MemberRow />
        <MemberRow />
        <MemberRow />
        <MemberRow />
      </div>

      {/* Carousel / Charts area */}
      <div className="mt-5 pt-4 border-t border-light-border dark:border-dark-border">
        <div className="flex gap-4 overflow-x-auto"></div>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-light-border dark:bg-dark-border"></div>
          <div className="w-2 h-2 rounded-full bg-light-border dark:bg-dark-border"></div>
          <div className="w-2 h-2 rounded-full bg-light-border dark:bg-dark-border"></div>
          <div className="w-2 h-2 rounded-full bg-light-border dark:bg-dark-border"></div>
          <div className="w-2 h-2 rounded-full bg-light-border dark:bg-dark-border"></div>
        </div>
      </div>
      <div className="mx-2 mb-2 mt-14 rounded-lg divide-y divide-light-border dark:divide-dark-border border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
        <div className="h-14 flex items-center justify-between">
          <div className="w-1/3 space-y-1 mx-2">
            <div className="skeleton h-6 rounded-lg"></div>
            <div className="skeleton w-3/4 h-4 rounded-md"></div>
          </div>
          <div className="skeleton w-20 h-8 mx-2 rounded-lg"></div>
          <div className="skeleton w-10 h-8 mx-2 rounded-lg"></div>
        </div>
        <div className="h-14 flex items-center justify-between">
          <div className="w-1/3 space-y-1 mx-2">
            <div className="skeleton h-6 rounded-lg"></div>
            <div className="skeleton w-3/4 h-4 rounded-md"></div>
          </div>
          <div className="skeleton w-20 h-8 mx-2 rounded-lg"></div>
          <div className="skeleton w-10 h-8 mx-2 rounded-lg"></div>
        </div>
        <div className="h-14 flex items-center justify-between">
          <div className="w-1/3 space-y-1 mx-2">
            <div className="skeleton h-6 rounded-lg"></div>
            <div className="skeleton w-3/4 h-4 rounded-md"></div>
          </div>
          <div className="skeleton w-20 h-8 mx-2 rounded-lg"></div>
          <div className="skeleton w-10 h-8 mx-2 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonOverview;
