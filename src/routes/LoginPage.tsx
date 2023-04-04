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

interface FormDataType {
  username: string;
  pwd: string;
  role?: string;
}

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { token, setToken } = useContext(MyContext);
  const [formData, setFormData] = useState({
    username: "",
    pwd: "",
    role: "",
  });
  const [errMsg, setErrMsg] = useState({
    username: "",
    pwd: "",
    role: "",
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token.tokenStr) {
      console.log("initializing...");
      setTimeout(() => {
        localStorage.removeItem("jwt");
        console.log("clear jwt");
      }, 60000 * 45);
      //navigate to home page
      navigate("/");
    }
  }, [token, navigate]);

  const setJwtToLocalStorage = (token: string) => {
    localStorage.setItem("jwt", token);
  };
  const [isLoad, setIsLoad] = useState(false);

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
        setJwtToLocalStorage(JSON.stringify(data));
        setToken(data);
      } else {
        throw new Error(`${data.message}`);
      }
    } catch (err) {
      navigate(`/error/${err}`);
    }
  };

  const validate = (inputName: string, inputVal: string) => {
    let error = "";
    switch (inputName) {
      case "username":
        if (!inputVal.length) {
          error = `can't be empty`;
        } else if (inputVal.length < 6) {
          error = `must be at least 7 characters`;
        }
        setErrMsg((pre) => {
          return {
            ...pre,
            username: error,
          };
        });
        break;
      case "pwd":
        if (!inputVal.length) {
          error = `can't be empty`;
        } else if (inputVal.length < 6) {
          error = `must be at least 7 characters`;
        }
        setErrMsg((pre) => {
          return {
            ...pre,
            pwd: error,
          };
        });
        break;
      case "role":
        if (!inputVal.length) {
          error = `can't be empty`;
        }
        setErrMsg((pre) => {
          return {
            ...pre,
            role: error,
          };
        });
        break;

      default:
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((obj) => {
      return {
        ...obj,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoad(true);
    if (Object.values(errMsg).every((el) => el === "")) {
      fetchToken(formData);
    } else {
      setIsLoad(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setErrMsg((pre) => {
      return {
        ...pre,
        [e.target.name]: "",
      };
    });
  };

  return (
    <FormLayout>
      <Stack spacing={2}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={1} direction="column">
            <TextField
              variant="standard"
              autoComplete="off"
              required
              label="username"
              name="username"
              value={formData.username}
              error={Boolean(errMsg.username)}
              helperText={errMsg.username}
              onFocus={handleFocus}
              onBlur={(e) => validate(e.target.name, e.target.value)}
              onChange={handleChange}
            />
            <FormControl variant="standard">
              <InputLabel htmlFor="standard-adornment-password" required>
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                name="pwd"
                value={formData.pwd}
                error={Boolean(errMsg.pwd)}
                onFocus={handleFocus}
                onBlur={(e) => validate(e.target.name, e.target.value)}
                onChange={handleChange}
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
                {errMsg.pwd === ""
                  ? "Do not share your password with others "
                  : errMsg.pwd}
              </FormHelperText>
            </FormControl>
            {isLogin && (
              <TextField
                required
                fullWidth
                variant="standard"
                select
                label="select role"
                name="role"
                value={formData.role}
                helperText={errMsg.role || " "}
                onFocus={handleFocus}
                onBlur={(e) => validate(e.target.name, e.target.value)}
                onChange={handleChange}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </TextField>
            )}
          </Stack>

          <Stack direction="row-reverse">
            <Stack spacing={1} direction={"column"}>
              <Button color="primary" variant="contained" type="submit">
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
        </form>
      </Stack>
    </FormLayout>
  );
};
