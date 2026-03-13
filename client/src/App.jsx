import { Outlet, RouterProvider, createBrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import MyOrdersPage from "./pages/MyOrders.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CartPage from "./pages/Cart.jsx";
import AdminOrdersPage from "./pages/AdminOrders.jsx";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        element: <ProtectedRoute roles={["user", "admin"]} />,
        children: [{ path: "/cart", element: <CartPage /> }],
      },
      {
        element: <ProtectedRoute roles={["user"]} />,
        children: [
          { path: "/orders/my", element: <MyOrdersPage /> },
        ],
      },
      {
        element: <ProtectedRoute roles={["admin"]} />,
        children: [
          { path: "/admin", element: <AdminDashboard /> },
          { path: "/admin/orders", element: <AdminOrdersPage /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;

