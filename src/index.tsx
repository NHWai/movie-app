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
import { LoginPage } from "./components/LoginPage";
import App from "./App";
import { MyProvider } from "./components/MyProvider";
import Movie from "./components/Movie";
import { Error } from "./components/Error";
import { MuiNavbar } from "./MuiNavbar";
import { AddCast } from "./components/AddCast";
import { ErrorGlobal } from "./components/ErrorGlobal";
import { AddMovie } from "./components/AddMovie";
import { EditMovie } from "./components/EditMovie";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MuiNavbar />}>
      <Route index element={<App />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="movie/:id" element={<Movie />} errorElement />
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
