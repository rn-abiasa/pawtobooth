import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";

import { PawProvider } from "./state";
import Index from "./pages/index";
import Studio from "./pages/Studio";
import Print from "./pages/Print";
import Result from "./pages/Result";

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/studio", element: <Studio /> },
  { path: "/print", element: <Print /> },
  { path: "/result", element: <Result /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PawProvider>
      <RouterProvider router={router} />
    </PawProvider>
  </StrictMode>,
);
