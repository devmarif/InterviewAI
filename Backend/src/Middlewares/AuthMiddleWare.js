import jwt from "jsonwebtoken";
import tokenBlackList from "../Models/tokenBlackListModel.js";


/**
 * Authentication middleware for protected routes.
 *
 * This middleware:
 * - Retrieves the JWT token from the `token` cookie.
 * - Checks whether the token has been blacklisted.
 * - Verifies the JWT using the application's secret key.
 * - Stores the decoded user information in `req.user`.
 * - Passes control to the next middleware or controller when
 *   authentication is successful.
 *
 * @async
 * @function authUser
 *
 * @param {import("express").Request} req
 * Express request object containing the authentication cookie.
 *
 * @param {import("express").Response} res
 * Express response object used to send authentication errors.
 *
 * @param {import("express").NextFunction} next
 * Express callback used to pass control to the next middleware.
 *
 * @returns {Promise<void>}
 *
 * @throws {JsonWebTokenError}
 * Returns a 401 response when the JWT is invalid, expired,
 * or has been blacklisted.
 *
 * @example
 * // Protect a route using the authentication middleware
 * authRoutes.get(
 *     "/me",
 *     AuthMiddleWare.authUser,
 *     AuthControllers.getAuthenticatedUserController
 * );
 */
const authUser = async (req, res, next) => {

    // Get JWT token from authentication cookie
    const token = req.cookies.token;

    // Check whether token exists
    if (!token) {
        return res.status(401).json({
            message: "Token Not Found"
        });
    }


    /**
     * Check whether the JWT has been blacklisted.
     *
     * A blacklisted token is usually added to the database
     * when the user logs out.
     */
    const isTokenBlackListed = await tokenBlackList.findOne({
        token
    });

    if (isTokenBlackListed) {
        return res.status(401).json({
            message: "Token Blacklisted"
        });
    }


    try {

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        // Attach decoded user information to the request
        req.user = decoded;

        // Continue to the next middleware/controller
        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or Expired Token"
        });
    }
};


export default {
    authUser
};
