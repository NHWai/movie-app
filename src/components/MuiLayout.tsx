import { Box } from "@mui/material";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export const MuiLayout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        // minHeight: "95vh",
        display: "flex",
        flexDirection: "column",
        paddingY: "1rem",
        paddingX: "1.25rem",
        maxWidth: "1024px",
        marginX: "auto",
      }}
    >
      {children}
    </Box>
  );
};
