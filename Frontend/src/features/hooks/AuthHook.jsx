import { useContext } from "react";

import { authContext } from "../Contexts/AuthContext";

import { login, register, logOut, userData } from "../../APIs/AuthAPI";

/**
 * Custom authentication hook.
 *
 * Provides authentication state and authentication-related
 * operations to React components.
 *
 * @returns {Object} Authentication state and handlers.
 */
export const useAuth = () => {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;

  /**
   * Handles user login.
   *
   * @param {string} email
   * @param {string} password
   *
   * @returns {Promise<Object>}
   */
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);

      const response = await login(email, password);

      console.log("Login response:", response);

      setUser(response.user);

      return response;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles user registration.
   *
   * @param {string} username
   * @param {string} email
   * @param {string} password
   *
   * @returns {Promise<Object>}
   */
  const handleRegister = async (username, email, password) => {
    try {
      setLoading(true);

      const response = await register(username, email, password);

      setUser(response.data);

      return response.data;
    } catch (error) {
      console.error("Registration Error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles user logout.
   *
   * Clears the authenticated user after
   * successfully logging out.
   *
   * @returns {Promise<Object>}
   */
  const handleLogout = async () => {
    try {
      setLoading(true);

      const response = await logOut();

      setUser(null);

      return response;
    } catch (error) {
      console.error("Logout Error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Checks whether the current user is authenticated.
   *
   * This should normally be called when the application
   * starts so that ProtectedRoute knows whether the user
   * has an existing authenticated session.
   *
   * @returns {Promise<Object|null>}
   */
  const checkAuth = async () => {
    try {
      setLoading(true);

      const response = await userData();

      setUser(response.data);

      return response.data;
    } catch (error) {
      console.error("Authentication Check Error:", error);

      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Authentication state and operations.
   */
  return {
    user,

    loading,

    handleLogin,

    handleRegister,

    handleLogout,

    checkAuth,
  };
};
