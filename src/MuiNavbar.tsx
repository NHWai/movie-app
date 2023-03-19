import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { initialToken, MyContext } from "./components/MyProvider";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
export const MuiNavbar = () => {
  const { token, setToken } = React.useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (token.tokenStr) {
      setToken(initialToken);
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Button onClick={() => navigate("/")} color="inherit">
                Movies{" "}
              </Button>
            </Box>
            {token.username && (
              <Typography
                fontStyle={"italic"}
                sx={{ mr: 2 }}
                align="center"
                style={{ fontSize: "11px" }}
              >
                Logged in as <br />
                <b>{token.username}</b>
              </Typography>
            )}
            {location["pathname"] !== "/login" && (
              <Button onClick={handleClick} color="inherit">
                {token.tokenStr ? "Logout" : "Login"}
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
};
