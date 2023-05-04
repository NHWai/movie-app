import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useContext, useState } from "react";
import { Outlet, useLocation, Link as RouterLink } from "react-router-dom";
import { initialToken, MyContext } from "./MyProvider";
import { movieGenres } from "../routes/AddMovie";
import { useSearchParams } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";

export const MuiNavbar = () => {
  const { token, setToken, colorMode } = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();

  React.useEffect(() => setAnchorEl(null), [token.tokenStr]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setToken(initialToken);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              sx={{ display: { xs: "block", sm: "none" } }}
              color="inherit"
              onClick={() => setMobileOpen((pre) => !pre)}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Button component={RouterLink} to="/" color="inherit">
                Movies
              </Button>
            </Box>
            {/* <div>darkmode</div> */}
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            {token.tokenStr ? (
              <div>
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem
                    component={RouterLink}
                    to={`/?userid=${token.id}`}
                    onClick={() => setAnchorEl(null)}
                  >
                    <Typography
                      fontWeight={"bold"}
                      fontStyle={"italic"}
                      variant="caption"
                    >
                      {token.username}
                      <Divider />
                    </Typography>{" "}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography
                      variant="caption"
                      fontWeight={"bold"}
                      sx={{ color: "red" }}
                    >
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </div>
            ) : location.pathname !== "/login" ? (
              <Button component={RouterLink} to="/login" color="inherit">
                Login
              </Button>
            ) : null}
          </Toolbar>
        </AppBar>
        <Box component={"nav"}>
          <Drawer
            open={mobileOpen}
            onClose={() => setMobileOpen((pre) => !pre)}
            variant="temporary"
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
            }}
          >
            <Typography align="center" variant="h5" my={2}>
              Movie App
            </Typography>
            <Divider />

            <Button
              size="small"
              component={RouterLink}
              to="/create"
              sx={{
                width: "fit-content",
                mx: "auto",
                my: 1,
              }}
              variant="outlined"
              color="success"
              endIcon={<AddIcon fontSize="inherit" />}
            >
              New Movie
            </Button>

            {/* <Divider /> */}
            <Autocomplete
              size="small"
              disablePortal
              value={searchParams.get("genres") || null}
              onChange={(e: any, newValue: string | null) => {
                !newValue
                  ? setSearchParams("")
                  : setSearchParams(`?genres=${newValue}`);
              }}
              options={movieGenres}
              sx={{ px: 2, mt: 2 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Search Movie By Genre"
                />
              )}
            />
          </Drawer>
        </Box>
      </Box>
      <Outlet />
    </>
  );
};
