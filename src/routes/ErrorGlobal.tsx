import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { MuiLayout } from "../components/MuiLayout";

export const ErrorGlobal = () => {
  return (
    <MuiLayout>
      <Typography sx={{ fontStyle: "italic" }} variant="h3">
        404:Not Found
      </Typography>
      <Link to="/">Go back to main page</Link>
    </MuiLayout>
  );
};
