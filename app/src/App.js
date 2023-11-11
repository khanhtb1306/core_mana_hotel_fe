import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { viVN as dataGridViVN } from "@mui/x-data-grid";
import { viVN as coreViVN } from "@mui/material/locale";
import { viVN } from "@mui/x-date-pickers/locales";
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
import ListReservationPage, {
  loader as loadReservations,
} from "./pages/Reservation/listReservation";
import ListRoomPage, {
  loader as loadRooms,
} from "./pages/Reservation/listRoom";
import EditReservationPage, {
  loader as loadReservationById,
  action as actionReservationById,
} from "./pages/Reservation/editReservation";

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
    element: <ListReservationPage />,
    loader: loadReservations,
  },
  {
    path: "listReservation",
    element: <ListReservationPage />,
    loader: loadReservations,
  },
  {
    path: "editReservation/:reservationId",
    element: <EditReservationPage />,
    loader: loadReservationById,
    action: actionReservationById,
  },
  {
    path: "listRoom",
    element: <ListRoomPage />,
    loader: loadRooms,
  },
  {
    path: "addReservation",
    element: <AddReservationPage />,
    loader: loadNewReservation,
  },
  {
    path: "editReservation",
    element: <EditReservationPage />,
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

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  viVN,
  dataGridViVN,
  coreViVN
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="bg-gray-100 min-h-screen max-h-full">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
