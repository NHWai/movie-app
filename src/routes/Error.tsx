import { Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MuiLayout } from "../components/MuiLayout";

export const Error = () => {
  let { msg } = useParams();
  const navigate = useNavigate();
  return (
    <MuiLayout>
      <Button
        variant="outlined"
        sx={{ width: "fit-content" }}
        onClick={() => navigate(-1)}
      >
        go back
      </Button>
      <Typography align="center" variant="h2">
        {msg}
      </Typography>
    </MuiLayout>
  );
};
