import { Button } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MuiLayout } from "../components/MuiLayout";

export const Error = () => {
  let { msg } = useParams();
  const navigate = useNavigate();
  return (
    <MuiLayout>
      <h2>{msg}</h2>
      <Button
        variant="contained"
        sx={{ width: "fit-content" }}
        onClick={() => navigate(-1)}
      >
        go back
      </Button>
    </MuiLayout>
  );
};
