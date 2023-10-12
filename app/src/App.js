import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/Error';
import LoginPage, { action as authAction } from './pages/Login';
import RoomManagementPage from './pages/RoomManagement';
import CategoryManagementPage from './pages/CategoryManagement';
import ProductManagementPage from './pages/ProductManagement';
import CustomerManagementPage from './pages/CustomerManagement';
import StocktakeManagementPage from './pages/StocktakeManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    children: [
      { index: true, element: <>Home</> },
      {
        path: '/categoryRoomManagement',
        element: <CategoryManagementPage />,
      },
      {
        path: '/roomManagement',
        element: <RoomManagementPage />,
      },
      {
        path: '/productManagement',
        element: <ProductManagementPage />,
      },
      {
        path: '/stocktakeManagement',
        element: <StocktakeManagementPage />,
      },
      {
        path: '/customerManagement',
        element: <CustomerManagementPage />,
      }
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
    action: authAction,
    errorElement: <ErrorPage />,
  },
  {
    path: '/logout'
  }
]);


function App() {
  return <div className="bg-gray-100 h-screen w-screen"><RouterProvider router={router} /></div>;
}

export default App;