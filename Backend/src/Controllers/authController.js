import tokenBlackList from "../Models/tokenBlackListModel.js";
import userModel from "../Models/usersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Register a new user.
 *
 * This controller:
 * - Validates the required user fields.
 * - Checks whether the username or email already exists.
 * - Hashes the user's password using bcrypt.
 * - Creates a new user in MongoDB.
 * - Generates a JWT authentication token.
 * - Stores the JWT in an HTTP cookie.
 *
 * @route   POST /api/auth/register
 * @access  Public
 *
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 *
 * @body
 * {
 *   userName: string,
 *   email: string,
 *   password: string
 * }
 *
 * @returns {Object} 201 - User registered successfully.
 * @returns {Object} 400 - Required fields are missing or user already exists.
 * @returns {Object} 500 - Internal server error.
 */
const registerUsersController = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Check required fields
        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "All Fields Are Required",
            });
        }

        // Check if user already exists
        const userAlreadyExists = await userModel.findOne({
            $or: [{ userName }, { email }],
        });

        if (userAlreadyExists) {
            return res.status(400).json({
                message: "User Already Exists",
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await userModel.create({
            userName,
            email,
            password: hashPassword,
        });

        // Create JWT token
        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.userName,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1d",
            },
        );

        // Store token in cookie
        res.cookie("token", token);

        return res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: newUser._id,
                username: newUser.userName,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * Authenticate an existing user.
 *
 * This controller:
 * - Retrieves the user's email and password.
 * - Finds the user in MongoDB.
 * - Compares the provided password with the hashed password.
 * - Generates a JWT if authentication succeeds.
 * - Stores the JWT in an HTTP cookie.
 *
 * @route   POST /api/auth/login
 * @access  Public
 *
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 *
 * @body
 * {
 *   email: string,
 *   password: string
 * }
 *
 * @returns {Object} 200 - User logged in successfully.
 * @returns {Object} 400 - User does not exist.
 * @returns {Object} 401 - Invalid password.
 * @returns {Object} 500 - Internal server error.
 */
const loggedInController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const verifyUser = await userModel.findOne({ email });

        if (!verifyUser) {
            return res.status(400).json({
                message: "Invalid User",
            });
        }

        // Compare password
        const decryptPassword = await bcrypt.compare(password, verifyUser.password);

        if (!decryptPassword) {
            return res.status(401).json({
                message: "Invalid Credentials",
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: verifyUser._id,
                username: verifyUser.userName,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1d",
            },
        );

        // Store token in cookie
        res.cookie("token", token);

        return res.status(200).json({
            message: "Logged In Successfully",
            user: {
                id: verifyUser._id,
                username: verifyUser.userName,
                email: verifyUser.email,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * Log out the currently authenticated user.
 *
 * This controller:
 * - Retrieves the JWT from the authentication cookie.
 * - Adds the token to the token blacklist collection.
 * - Clears the authentication cookie.
 *
 * @route   POST /api/auth/logout
 * @access  Public
 *
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 *
 * @cookie {string} token - JWT authentication token.
 *
 * @returns {Object} 200 - User logged out and token blacklisted.
 */
const logOutUserController = async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        await tokenBlackList.create({
            token,
        });
    }

    res.clearCookie("token");

    return res.status(200).json({
        message: "Token Blacklisted Successfully",
    });
};

/**
 * Fetch the currently authenticated user's information.
 *
 * This controller:
 * - Retrieves the authenticated user's ID from `req.user`.
 * - Finds the user in the database using the user ID.
 * - Returns the user's basic profile information.
 *
 * This controller should be used after the authentication
 * middleware has successfully verified the user's JWT.
 *
 * @route   GET /api/auth/me
 * @access  Private
 *
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 *
 * @returns {Object} 200 - Successfully fetched authenticated user.
 * @returns {Object} 404 - User not found.
 * @returns {Object} 500 - Internal server error.
 */
const getAuthenticatedUserController = async (req, res) => {
    try {

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        return res.status(200).json({
            message: "User Fetched Successfully",
            user: {
                id: user._id,
                username: user.userName,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};



/**
 * Authentication controller collection.
 *
 * @property {Function} registerUsersController
 * Registers a new user.
 *
 * @property {Function} loggedInController
 * Authenticates a user and generates a JWT.
 *
 * @property {Function} logOutUserController
 * Logs out the user and blacklists their JWT.
 *
 * @property {Function} getAuthenticatedUserController
 * Fetches the currently authenticated user's information.
 */
export default {
    registerUsersController,
    loggedInController,
    logOutUserController,
    getAuthenticatedUserController
};
