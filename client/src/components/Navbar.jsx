import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { useCartStore } from "../store/cartStore.js";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, it) => sum + it.quantity, 0),
  );

  return (
    <nav className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Restaurant App
        </Link>
      </div>
      <div className="flex-none gap-2">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          {cartCount > 0 && (
            <li>
              <Link to="/cart">
                Cart
                <span className="badge badge-sm ml-1">{cartCount}</span>
              </Link>
            </li>
          )}
          {isAuthenticated && user?.role === "user" && (
            <li>
              <Link to="/orders/my">My Orders</Link>
            </li>
          )}
          {user?.role === "admin" && (
            <>
              <li>
                <Link to="/admin">Admin</Link>
              </li>
              <li>
                <Link to="/admin/orders">All Orders</Link>
              </li>
            </>
          )}
        </ul>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm">Hi, {user?.name}</span>
              <button className="btn btn-outline btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost btn-sm" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary btn-sm" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

