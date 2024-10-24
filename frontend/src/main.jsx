import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Overview from "./pages/Overview.jsx";
import NewGroup from "./pages/NewGroup.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Admin from "./pages/Admin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Overview></Overview>,
      },
      {
        path: "/newGroup",
        element: <NewGroup></NewGroup>,
      },
      {
        path: "/admin",
        element: <Admin></Admin>,
      },
      {
        path: "*",
        element: <NotFoundPage></NotFoundPage>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
