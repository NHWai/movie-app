import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Error = () => {
  let { msg } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      <h2>{msg}</h2>
      <button onClick={() => navigate(-1)}>go back</button>
    </div>
  );
};
