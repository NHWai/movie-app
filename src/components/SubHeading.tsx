import React from "react";
import { Box, Typography, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../config/theme";

interface Props {
  title: string;
}

export default function SubHeading({ title }: Props) {
  return (
    <Box
      sx={{
        borderLeft: "3px solid blue",
        paddingLeft: "1rem",
        marginLeft: "-1rem",
        marginBottom: "1rem",
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Typography fontStyle={"italic"} variant="h6">
          {title}
        </Typography>
      </ThemeProvider>
    </Box>
  );
}
