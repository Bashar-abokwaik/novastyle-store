import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store";
import { lazy, Suspense } from "react";

// The App component serves as the main entry point for the application, setting up routing, theme management, and lazy loading of components.
import RootLayout from "./routes/RootLayout";
import AdminRoute from "./routes/AdminRoute";
import Spinner from "./components/UI/Spinner/Spinner";
import AdminLayout from "./components/layout/AdminLayout/AdminLayout";

const Register = lazy(() => import("./pages/authPages/Register"));
const VerifyEmailOTP = lazy(() => import("./pages/authPages/VerifyEmailOTP"));
const Login = lazy(() => import("./pages/authPages/Login"));
const ResetPassword = lazy(() => import("./pages/authPages/ResetPassword"));
const ForgetPassword = lazy(() => import("./pages/authPages/ForgetPassword"));
const Home = lazy(() => import("./pages/Home/Home"));
const ErrorPage = lazy(() => import("./pages/ErrorPage/ErrorPage"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Products = lazy(() => import("./pages/Products/Products"));
const ProductDetails = lazy(() => import("./pages/Products/ProductDetails"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CollectionsPage = lazy(() => import("./pages/Collections/Collections"));
const Cart = lazy(() => import("./pages/CartPages/Cart"));
const Dashboard = lazy(() => import("./pages/admin/dashboard/Dashboard"));
const Users = lazy(() => import("./pages/admin/users/Users"));
const UserInfo = lazy(() => import("./pages/admin/users/UserInfo"));
const ProductsAdmin = lazy(
  () => import("./pages/admin/products/ProductsAdmin"),
);
const AddProduct = lazy(() => import("./pages/admin/products/AddProduct"));
const EditProduct = lazy(() => import("./pages/admin/products/EditProduct"));
const CategoriesAdmin = lazy(
  () => import("./pages/admin/categories/Categories"),
);
const AddCategory = lazy(() => import("./pages/admin/categories/AddCategory"));
const EditCategory = lazy(
  () => import("./pages/admin/categories/EditCategory"),
);
const CollectionsAdmin = lazy(
  () => import("./pages/admin/collection/Collection"),
);
const AddCollection = lazy(
  () => import("./pages/admin/collection/AddCollection"),
);
const EditCollection = lazy(
  () => import("./pages/admin/collection/EditCollection"),
);
const AdminOrders = lazy(() => import("./pages/admin/orders/Orders"));
const OrderInfo = lazy(() => import("./pages/admin/orders/OrderInfo"));
const Checkout = lazy(() => import("./pages/CartPages/Checkout"));
const MyProfile = lazy(() => import("./pages/Profile/MyProfile"));
const MyOrders = lazy(() => import("./pages/Orders/MyOrders"));
const OrderPage = lazy(() => import("./pages/Orders/OrderPage"));
const Newsletter = lazy(() => import("./pages/admin/newsletter/Newsletter"));

const router = createBrowserRouter([
  // Admin routes are protected by the AdminRoute component, which checks if the user has admin privileges before granting access to the admin panel.
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:userId",
        element: <UserInfo />,
      },
      {
        path: "products",
        element: <ProductsAdmin />,
      },
      {
        path: "products/add",
        element: <AddProduct />,
      },
      {
        path: "products/edit/:productId",
        element: <EditProduct />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "orders/:orderId",
        element: <OrderInfo />,
      },
      {
        path: "categories",
        element: <CategoriesAdmin />,
      },
      {
        path: "categories/add",
        element: <AddCategory />,
      },
      {
        path: "categories/edit/:categoryId",
        element: <EditCategory />,
      },
      {
        path: "collections",
        element: <CollectionsAdmin />,
      },
      {
        path: "collections/add",
        element: <AddCollection />,
      },
      {
        path: "collections/edit/:collectionId",
        element: <EditCollection />,
      },
      {
        path: "newsletter",
        element: <Newsletter />,
      },
    ],
  },
  // Public routes accessible to all users, including the home page, product listings, contact page, authentication pages, and user profile management.
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
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "collections/:slug",
        element: <CollectionsPage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailOTP />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "profile",
        element: <MyProfile />,
      },
      {
        path: "orders",
        element: <MyOrders />,
      },
      {
        path: "orders/:orderId",
        element: <OrderPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

// The App component serves as the main entry point for the application, setting up routing, theme management, and lazy loading of components.
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

  // Render the RouterProvider component with the defined router configuration, wrapped in a Suspense component to handle lazy loading of routes and display a spinner while loading.
  return (
    <Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
