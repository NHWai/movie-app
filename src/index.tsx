import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import reportWebVitals from "./reportWebVitals";

import "./App.css";
import { LoginPage } from "./routes/LoginPage";
import App from "./App";
import { MyProvider } from "./components/MyProvider";
import Movie from "./routes/Movie";
import { Error } from "./routes/Error";
import { MuiNavbar } from "./components/MuiNavbar";
import { AddCast } from "./routes/AddCast";
import { ErrorGlobal } from "./routes/ErrorGlobal";
import { AddMovie } from "./routes/AddMovie";
import { EditMovie } from "./routes/EditMovie";
import Paper from "@mui/material/Paper";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MuiNavbar />}>
      <Route index element={<App />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="movie/:id" element={<Movie />} />
      <Route path="cast/:movieId" element={<AddCast />} />
      <Route path="error/:msg" element={<Error />} />
      <Route path="create" element={<AddMovie />} />
      <Route path="edit/:movieId" element={<EditMovie />} />
      <Route path="*" element={<ErrorGlobal />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <MyProvider>
    <RouterProvider router={router} />
  </MyProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

//react router config here
