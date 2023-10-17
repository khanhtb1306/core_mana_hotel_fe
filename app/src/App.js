import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/Error";
import LoginPage, { action as loginAction } from "./pages/Authentication/login";
import { action as logoutAction } from "./pages/Authentication/logout";
import RoomManagementPage from "./pages/RoomManagement";
import CategoryManagementPage from "./pages/CategoryManagement";
import ProductManagementPage from "./pages/ProductManagement";
import CustomerManagementPage from "./pages/CustomerManagement";
import StocktakeManagementPage from "./pages/StocktakeManagement";
import { checkAuthLoader, tokenLoader } from "./contexts/auth";
import ManagerLayout from "./pages/ManagerLayout";
import ReceptionistLayout from "./pages/ReceptionistLayout";

const routesForManager = [
  {
    index: true,
    element: <>Manager</>,
  },
  {
    path: "overview",
    element: <>Manager</>,
  },
  {
    path: "categoryRoomManagement",
    element: <CategoryManagementPage />,
  },
  {
    path: "roomManagement",
    element: <RoomManagementPage />,
  },
  {
    path: "productManagement",
    element: <ProductManagementPage />,
  },
  {
    path: "stocktakeManagement",
    element: <StocktakeManagementPage />,
  },
  {
    path: "customerManagement",
    element: <CustomerManagementPage />,
  },
];

const routesForReceptionist = [
  {
    index: true,
    element: <>Hehe reservation true</>,
  },
  {
    path: "reservation",
    element: <>Hehe reservation</>,
  },
  {
    path: "auto",
    element: <>Auto</>,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        element: <ReceptionistLayout />,
        loader: checkAuthLoader,
        children: [...routesForReceptionist],
      },
      {
        path: "manager",
        element: <ManagerLayout />,
        loader: checkAuthLoader,
        children: [...routesForManager],
      },

      {
        path: "error",
        element: <ErrorPage />,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    action: loginAction,
  },
]);

function App() {
  return (
    <div className="bg-gray-100 h-screen w-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
