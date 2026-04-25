import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store";

import RootLayout from "./routes/RootLayout";
import Home from "./pages/Home/Home";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import NotFound from "./pages/NotFound/NotFound";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/Products/ProductDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/category/:slug",
        element: <Products />,
      },
      {
        path: "products/:productId",
        element: <ProductDetails />,
      },
      {
        path: "offers",
        element: <Products mode="offers" />,
      },
      {
        path: "offers/category/:slug",
        element: <Products mode="offers" />,
      },
      {
        path: "offers/:productId",
        element: <ProductDetails />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  const mode = useSelector((state: RootState) => state.theme.mode); // Get current theme mode from Redux store

  // Update the data-theme attribute on the root element whenever the theme mode changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  // Save the current theme mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  return <RouterProvider router={router} />;
}

export default App;
