import axios from "axios";

/**
 * Base URL for all authentication-related API endpoints.
 */
const API_URL = "http://localhost:3000/api/auth";

/**
 * Register a new user.
 *
 * Creates a new user account using the provided username,
 * email address, and password.
 *
 * @async
 * @function register
 *
 * @param {string} username - Username of the new user.
 * @param {string} email - Email address of the new user.
 * @param {string} password - Password for the new account.
 *
 * @returns {Promise<Object>} API response containing the
 * registration result and user information.
 *
 * @throws {Error} Throws an error if registration fails.
 *
 * @endpoint POST /api/auth/register
 */
export const register = async (username, email, password) => {
    try {
        const response = await axios.post(
            `${API_URL}/register`,
            {
                userName: username,
                email,
                password,
            },
            {
                withCredentials: true,
            },
        );

        return response.data;
    } catch (error) {
        console.error(
            "Register API Error:",
            error.response?.data || error.message,
        );

        throw error;
    }
};


/**
 * Login an existing user.
 *
 * Authenticates a user using their email and password.
 * The authentication session is maintained using credentials/cookies.
 *
 * @async
 * @function login
 *
 * @param {string} email - Email address of the user.
 * @param {string} password - Password of the user.
 *
 * @returns {Promise<Object>} API response containing the
 * authentication result and user information.
 *
 * @throws {Error} Throws an error if authentication fails.
 *
 * @endpoint POST /api/auth/login
 */
export const login = async (email, password) => {
    try {
        const response = await axios.post(
            `${API_URL}/login`,
            {
                email,
                password,
            },
            {
                withCredentials: true,
            },
        );

        return response.data;
    } catch (error) {
        console.error(
            "Login API Error:",
            error.response?.data || error.message,
        );

        throw error;
    }
};


/**
 * Logout the currently authenticated user.
 *
 * Sends a logout request to the backend and clears the
 * authenticated user's session/cookie.
 *
 * @async
 * @function logOut
 *
 * @returns {Promise<Object>} API response containing the
 * logout status and message.
 *
 * @throws {Error} Throws an error if logout fails.
 *
 * @endpoint POST /api/auth/logout
 */
export const logOut = async () => {
    try {
        const response = await axios.post(
            `${API_URL}/logout`,
            {},
            {
                withCredentials: true,
            },
        );

        return response.data;
    } catch (error) {
        console.error(
            "Logout API Error:",
            error.response?.data || error.message,
        );

        throw error;
    }
};


/**
 * Get the currently authenticated user.
 *
 * Retrieves the user associated with the current authentication
 * session. The backend uses the authentication cookie/session
 * to identify the user.
 *
 * @async
 * @function userData
 *
 * @returns {Promise<Object>} API response containing the
 * authenticated user's information.
 *
 * @throws {Error} Throws an error if the user is not authenticated
 * or the request fails.
 *
 * @endpoint GET /api/auth/me
 */
export const userData = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/me`,
            {
                withCredentials: true,
            },
        );

        return response.data;
    } catch (error) {
        console.error(
            "User Data API Error:",
            error.response?.data || error.message,
        );

        throw error;
    }
};