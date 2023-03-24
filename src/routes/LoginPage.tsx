import React, { useContext, useState } from "react";
import {
  Stack,
  TextField,
  Button,
  IconButton,
  InputLabel,
  FormControl,
  FormHelperText,
  Input,
  MenuItem,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";

import { useNavigate } from "react-router-dom/";
import { FormLayout } from "../components/FormLayout";
import { MyContext } from "../components/MyProvider";

type FormDataType = {
  username: string;
  pwd: string;
  role?: string;
};

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    pwd: "",
    role: "",
  });
  const { token, setToken } = useContext(MyContext);
  const [isLoad, setIsLoad] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    token.tokenStr && navigate("/");
  }, [token, navigate]);

  const fetchToken = async (formDatas: FormDataType) => {
    const { username, pwd, role } = formDatas;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let baseurl = process.env.REACT_APP_BASE_URL;
    let endpoint;
    let raw;
    if (role) {
      //sign up
      console.log("sign up a user");
      endpoint = `${baseurl}/users`;
      raw = JSON.stringify({
        username: username,
        password: pwd,
        role: role,
      });
    } else {
      //login
      endpoint = `${baseurl}/users/login`;
      raw = JSON.stringify({
        username: username,
        password: pwd,
      });
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });

      const data = await res.json();
      if (res.status === 200) {
        console.log({ data });
        setToken(data);
      } else {
        throw new Error(`${data.message}`);
      }
    } catch (err) {
      navigate(`/error/${err}`);
    }
  };

  const validate = (str: string) => {
    if (!str.length || str.length < 6) {
      return false;
    }
    return true;
  };

  return (
    <FormLayout>
      <Stack spacing={2}>
        <Stack spacing={1} direction="column">
          <TextField
            label="username"
            variant="standard"
            required
            value={formData.username}
            helperText={
              !formData.username
                ? "required"
                : formData.username.length < 6
                ? "Must be at least 7 characters"
                : " "
            }
            onChange={(e) => {
              setFormData((obj) => {
                return {
                  ...obj,
                  username: e.target.value,
                };
              });
            }}
          />
          <FormControl variant="standard">
            <InputLabel htmlFor="standard-adornment-password" required>
              Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? "text" : "password"}
              value={formData.pwd}
              onChange={(e) => {
                setFormData((obj) => {
                  return {
                    ...obj,
                    pwd: e.target.value,
                  };
                });
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ height: "1.8rem" }}>
              {!formData.pwd
                ? "provide password"
                : formData.pwd.length < 6
                ? "Must be at least 7 characters"
                : "Do not share your password with others "}
            </FormHelperText>
          </FormControl>
          {isLogin && (
            <TextField
              required
              fullWidth
              variant="standard"
              select
              label="select role"
              value={formData.role}
              onChange={(e) =>
                setFormData((obj) => {
                  return {
                    ...obj,
                    role: e.target.value,
                  };
                })
              }
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </TextField>
          )}
        </Stack>

        <Stack direction="row-reverse">
          <Stack spacing={1} direction={"column"}>
            <Button
              color="primary"
              variant="contained"
              disabled={
                validate(formData.username) &&
                validate(formData.pwd) &&
                (!isLogin || formData.role)
                  ? false
                  : true
              }
              onClick={() => {
                setIsLoad(true);
                fetchToken(formData);
              }}
            >
              {isLoad ? "Loading" : isLogin ? "Sign Up" : "Login"}
            </Button>
            <Box
              component={"button"}
              sx={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                "&:hover": {
                  color: "primary.dark",
                },
              }}
              onClick={() => setIsLogin((pre) => !pre)}
            >
              {isLogin ? "Login" : "Sign Up"}
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </FormLayout>
  );
};
