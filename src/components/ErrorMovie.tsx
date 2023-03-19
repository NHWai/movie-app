import React from "react";
import { useRouteError } from "react-router-dom";

export const ErrorMovie = () => {
  let error = useRouteError();
  console.error(error);
  return <div>ErrorMovie</div>;
};
