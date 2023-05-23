import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { MuiLayout } from "../components/MuiLayout";
import { useLocation } from "react-router-dom";
export const ErrorGlobal = () => {
  const location = useLocation();
  return (
    <MuiLayout>
      <Typography sx={{ fontStyle: "italic" }} variant="h3">
        {location.state?.errMsg || "404:Not Found"}
      </Typography>
      <Link to="/">Go back to main page</Link>
    </MuiLayout>
  );
};
