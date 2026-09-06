import { createContext, useState } from "react";

/**
 * Authentication Context
 *
 * Provides authentication-related state and functions
 * to components throughout the application.
 *
 * Available values:
 * - user: Currently authenticated user's data.
 * - setUser: Updates the authenticated user's data.
 * - loading: Indicates whether an authentication operation is in progress.
 * - setLoading: Updates the loading state.
 */
export const authContext = createContext();

/**
 * Authentication Context Provider
 *
 * Wraps the application and provides authentication state
 * to all child components through `authContext`.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components
 * rendered inside the provider.
 *
 * @returns {JSX.Element} Authentication context provider.
 */
export const ContextProvider = ({ children }) => {
  /**
   * Stores the currently authenticated user's information.
   *
   * `null` means that no user is currently authenticated.
   */
  const [user, setUser] = useState(null);

  /**
   * Indicates whether an authentication-related operation
   * is currently being processed.
   *
   * Example:
   * - Login request
   * - Registration request
   * - Fetching current user
   */
  const [loading, setLoading] = useState(false);

  return (
    <authContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
