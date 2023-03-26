import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import React, { useContext } from "react";
import { Outlet, useLocation, Link as RouterLink } from "react-router-dom";
import { initialToken, MyContext } from "./MyProvider";
export const MuiNavbar = () => {
  const { token, setToken } = useContext(MyContext);
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setToken(initialToken);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Button component={RouterLink} to="/" color="inherit">
                Movies
              </Button>
            </Box>
            {token.tokenStr && (
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

            {token.tokenStr ? (
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            ) : location.pathname !== "/login" ? (
              <Button component={RouterLink} to="/login" color="inherit">
                Login
              </Button>
            ) : null}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
};
