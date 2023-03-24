import { Box } from "@mui/material";
import React from "react";
type Props = {
  children: React.ReactNode;
};

export const FormLayout = ({ children }: Props) => {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  );
};
