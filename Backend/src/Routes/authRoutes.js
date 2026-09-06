import { Router } from "express";

import authControllers from "../Controllers/authController.js";
import AuthMiddleWare from "../Middlewares/AuthMiddleWare.js";

const authRoutes = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { userName, email, password }
 */
authRoutes.post("/register", authControllers.registerUsersController);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and generate JWT token
 * @access  Public
 * @body    { email, password }
 */
authRoutes.post("/login", authControllers.loggedInController);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user, blacklist JWT token and clear authentication cookie
 * @access  Public
 * @cookies  token
 */
authRoutes.post("/logout", authControllers.logOutUserController);

/**
 * Verify the currently authenticated user.
 *
 * @route   GET /api/auth/me
 * @desc    Verifies the JWT token of the currently logged-in user
 *          and attaches the decoded user information to the request.
 * @access  Private
 *
 * @middleware authUser - Authentication middleware that validates
 *                        the user's JWT token.
 */
authRoutes.get("/me", AuthMiddleWare.authUser, authControllers.getAuthenticatedUserController);

export default authRoutes;
