import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/Error";
import LoginPage, { action as loginAction } from "./pages/Authentication/login";
import { action as logoutAction } from "./pages/Authentication/logout";
import RoomManagementPage, {
  loader as loadRoom,
  action as actionRoom,
} from "./pages/RoomManagement";
import CategoryManagementPage, {
  loader as loadCateRoom,
  action as actionCategoryRoom,
} from "./pages/CategoryManagement";
import ProductManagementPage, {
  loader as loadProducts,
  action as actionProduct,
} from "./pages/ProductManagement";
import CustomerManagementPage, {
  loader as loadCustomers,
  action as actionCustomer,
} from "./pages/CustomerManagement";
import StocktakeManagementPage, {
  loader as loadStocktakes,
  action as actionStocktakes,
} from "./pages/StocktakeManagement";
import { checkAuthLoader, tokenLoader } from "./contexts/auth";
import ManagerLayout from "./pages/ManagerLayout";
import ReceptionistLayout from "./pages/ReceptionistLayout";
import ReservationPage from "./pages/Reservation";
import AddReservationPage, {
  loader as loadNewReservation,
} from "./pages/Reservation/addReservation";
import AddInvoicePage from "./pages/Invoice/addInvoice";
import ForgetPasswordPage, {
  action as actionSendEmail,
} from "./pages/Authentication/forgetPassword";
import ResetPasswordPage, {
  action as actionChangePassword,
} from "./pages/Authentication/resetPassword";
import PriceManagementPage, {
  loader as loadPriceBooks,
  action as actionPriceBooks,
} from "./pages/PriceManagementPage";

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
    loader: loadCateRoom,
    action: actionCategoryRoom,
  },
  {
    path: "roomManagement",
    element: <RoomManagementPage />,
    loader: loadRoom,
    action: actionRoom,
  },
  {
    path: "productManagement",
    element: <ProductManagementPage />,
    loader: loadProducts,
    action: actionProduct,
  },
  {
    path: "stocktakeManagement",
    element: <StocktakeManagementPage />,
    loader: loadStocktakes,
    action: actionStocktakes,
  },
  {
    path: "customerManagement",
    element: <CustomerManagementPage />,
    loader: loadCustomers,
    action: actionCustomer,
  },
  {
    path: "priceBook",
    element: <PriceManagementPage />,
    loader: loadPriceBooks,
    action: actionPriceBooks,
  },
];

const routesForReceptionist = [
  {
    index: true,
    element: <ReservationPage />,
  },
  {
    path: "reservation",
    element: <ReservationPage />,
  },
  {
    path: "addReservation",
    element: <AddReservationPage />,
    loader: loadNewReservation,
  },
  {
    path: "addInvoice",
    element: <AddInvoicePage />,
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
  {
    path: "/forgetPassword",
    element: <ForgetPasswordPage />,
    action: actionSendEmail,
  },
  {
    path: "resetPassword",
    id: "token",
    loader: checkAuthLoader,
    element: <ResetPasswordPage />,
    action: actionChangePassword,
  },
]);

function App() {
  return (
    <div className="bg-gray-100 min-h-screen max-h-full w-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
