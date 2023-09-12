import { createTheme } from "@mui/material/styles";
import Lily from "../fonts/LilyScriptOneRegular.ttf";

const theme = createTheme({
  typography: {
    fontFamily: "Lily",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": {
          fontFamily: "Lily",
          src: `url(${Lily}) format("truetype")`,
        },
      },
    },
  },
});

export default theme;
