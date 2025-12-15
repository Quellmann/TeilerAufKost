import React from "react";

const SkeletonForm = () => (
  <div className="">
    <div className="text-3xl mb-8 blur">Neue Ausgabe hinzufügen</div>
    <div className="skeleton h-12 w-full rounded-lg"></div>
    <div className="mt-5 skeleton h-12 w-1/2 mx-auto rounded-lg"></div>
    <div className="mt-3 skeleton h-12 w-1/2 mx-auto rounded-lg"></div>
    <div className="mt-5 skeleton h-36 w-full rounded-lg"></div>
    <div className="mt-3 skeleton h-36 w-full rounded-lg"></div>
    <div className="mt-5 skeleton h-12 w-1/3 mx-auto rounded-lg"></div>
  </div>
);

export default SkeletonForm;
