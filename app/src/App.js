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
  action as actionNewReservation,
} from "./pages/Reservation/addReservation";
import AddInvoicePage, {
  loader as loadInvoice,
  action as actionInvoice,
} from "./pages/Invoice/addInvoice";
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
  action as actionListRooms,
} from "./pages/Reservation/listRoom";
import EditReservationPage, {
  loader as loadReservationById,
  action as actionReservationById,
} from "./pages/Reservation/editReservation";
import PolicyManagementPage, {
  loader as loadPolicy,
  action as actionPolicy,
} from "./pages/PolicyManagement/index";
import OverviewManagementPage, {
  loader as loadOverview,
} from "./pages/OverviewManagementPage";
import TransactionManagementPage, {
  loader as loadTransaction,
} from "./pages/TransactionManagement";
import ImportManagementPage, {
} from "./pages/ImportManagement";
import FundBookManagementPage, {
  loader as loadFundBooks,
  action as actionFundBooks
}from "./pages/FundBookManagement";
import StaffManagementPage,{
  loader as loadStaffs,
  action as actionStaff,
} from "./pages/StaffManagement";

import InforManagementPage, {
  loader as loadInforManagement,
  action as actionInforManagement,
} from "./pages/InforManagement";

const routesForManager = [
  {
    index: true,
    element: <OverviewManagementPage />,
    loader: loadOverview,
  },
  {
    path: "overview",
    element: <OverviewManagementPage />,
    loader: loadOverview,
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
    path: "transactionManagement",
    element: <TransactionManagementPage />,
    loader: loadTransaction,
  },
  {
    path: "importManagement",
    element: <ImportManagementPage />,
  },
  {
    path: "fundBookManagement",
    element: <FundBookManagementPage />,
    loader: loadFundBooks,
    action: actionFundBooks

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
  {
    path: "policy",
    element: <PolicyManagementPage />,
    loader: loadPolicy,
    action: actionPolicy,
  },
  {
    path: "staffManagement",
    element: <StaffManagementPage />,
    loader: loadStaffs,
    action: actionStaff,
  },
  {
    path: "inforManagement",
    element: <InforManagementPage />,
    loader: loadInforManagement,
    action: actionInforManagement,
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
    action: actionListRooms,
  },
  {
    path: "addReservation",
    element: <AddReservationPage />,
    loader: loadNewReservation,
    action: actionNewReservation,
  },
  {
    path: "addInvoice",
    element: <AddInvoicePage />,
    loader: loadInvoice,
    action: actionInvoice,
  },
  {
    path: "account",
    element: <InforManagementPage />,
    loader: loadInforManagement,
    action: actionInforManagement,
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
