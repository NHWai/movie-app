import { useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [pwdError, setPwdError] = useState(false);
  const [usrnameErr, setUsrnameErr] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    pwd: "",
    role: "",
  });
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={4}>
        <Stack spacing={2} direction="column">
          <TextField
            error={!formData.username && usrnameErr ? true : false}
            label="username"
            variant="standard"
            required
            value={formData.username}
            onChange={(e) => {
              setUsrnameErr(true);
              setFormData((obj) => {
                return {
                  ...obj,
                  username: e.target.value,
                };
              });
            }}
          />
          <FormControl
            sx={{ m: 1, width: "25ch" }}
            variant="standard"
            error={!formData.pwd && pwdError ? true : false}
          >
            <InputLabel htmlFor="standard-adornment-password" required>
              Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? "text" : "password"}
              value={formData.pwd}
              onChange={(e) => {
                setPwdError(true);
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
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>
              {!formData.pwd && pwdError
                ? "provide password"
                : "Do not share your password "}
            </FormHelperText>
          </FormControl>
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
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
        </Stack>

        <Stack direction="row-reverse">
          <Stack spacing={1} direction={"column"}>
            <Button
              size="medium"
              color="primary"
              variant="contained"
              disabled={
                formData.username && formData.pwd && formData.role
                  ? false
                  : true
              }
            >
              Login
            </Button>
            <Button size="small">Sign In</Button>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};
