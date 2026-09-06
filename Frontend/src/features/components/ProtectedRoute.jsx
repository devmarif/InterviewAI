import { Navigate, Outlet } from "react-router";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "../hooks/AuthHook";

/**
 * Protects private application routes from unauthenticated users.
 *
 * Authentication flow:
 *
 * 1. Check whether authentication is still loading.
 * 2. Show a loading screen while authentication is being checked.
 * 3. Redirect unauthenticated users to the login page.
 * 4. Render the nested protected route using <Outlet />.
 *
 * @returns {JSX.Element}
 */
const ProtectedRoute = () => {
  const { loading, user } = useAuth();

  /**
   * Authentication is still being checked.
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/3">
            <LoaderCircle size={22} className="animate-spin text-indigo-400" />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-slate-300">
              Checking authentication
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Please wait a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * User is not authenticated.
   *
   * Redirect to login page.
   */
  if (!user) {
    return <Navigate to="/" replace />;
  }

  /**
   * User is authenticated.
   *
   * Render the nested protected route.
   */
  return <Outlet />;
};

export default ProtectedRoute;
