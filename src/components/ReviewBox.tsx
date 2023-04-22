import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

interface Props {
  reviewText: string;
  author: string;
  rating: number;
}

export const ReviewBox = ({ reviewText, author, rating }: Props) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          maxWidth: "800px",
          position: "relative",
          padding: "1.5rem",
          borderRadius: "0.3rem",
          boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
          transition: "0.3s",
          "&:hover": { boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" },
        }}
      >
        <Typography mb={1} variant="subtitle2">
          Rating: {rating}/<sub>5</sub>
        </Typography>
        <div>{reviewText}</div>

        <Box
          sx={{
            width: "0",
            height: "0",
            borderTop: "14px solid white",
            borderRight: "7px solid transparent",
            borderLeft: "7px solid transparent",
            position: "absolute",
            bottom: "1px",
            left: "3.3%",
            transform: "translateY(100%)",
            zIndex: "100",
          }}
        ></Box>
        <Box
          sx={{
            width: "0",
            height: "0",
            borderTop: "16px solid rgba(0,0,0,0.2)",
            borderRight: "8px solid transparent",
            borderLeft: "8px solid transparent",
            position: "absolute",
            bottom: 0,
            left: "3%",
            transform: "translateY(100%)",
          }}
        ></Box>
      </Box>
      <Typography mt={2} variant="subtitle2">
        {author}
      </Typography>
    </Box>
  );
};
