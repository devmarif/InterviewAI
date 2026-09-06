import express from "express";
import authRoutes from "./Routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRoutes from "./Routes/interviewRoutes.js";

/**
 * Express Application
 *
 * Creates the main Express application instance.
 *
 * This application is responsible for:
 *
 * - Parsing incoming requests
 * - Handling cookies
 * - Configuring CORS
 * - Registering authentication routes
 * - Registering interview report routes
 */
const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

/**
 * JSON Body Parser
 *
 * Parses incoming requests with a JSON payload and
 * makes the parsed data available through `req.body`.
 *
 * Used by APIs such as:
 *
 * POST /api/auth/register
 * POST /api/auth/login
 *
 * Example request body:
 *
 * {
 *     "email": "user@example.com",
 *     "password": "password123"
 * }
 */
app.use(express.json());


/**
 * Cookie Parser
 *
 * Parses cookies attached to incoming HTTP requests.
 *
 * This middleware is required when authentication uses
 * cookies, such as storing a JWT authentication token
 * inside an HTTP-only cookie.
 *
 * After parsing, cookies can be accessed using:
 *
 * req.cookies
 */
app.use(cookieParser());


/**
 * Cross-Origin Resource Sharing (CORS)
 *
 * Configures communication between the frontend and
 * backend running on different origins.
 *
 * Frontend:
 * http://localhost:5173
 *
 * Backend:
 * http://localhost:3000
 *
 * `credentials: true` allows authentication cookies
 * to be included in cross-origin requests.
 */
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);


// ======================================================
// ROUTES
// ======================================================

/**
 * Authentication Routes
 *
 * Registers all authentication-related endpoints.
 *
 * Base URL:
 * /api/auth
 *
 * Example endpoints:
 *
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/logout
 * GET  /api/auth/me
 *
 * The actual route definitions are maintained
 * inside `authRoutes`.
 */
app.use("/api/auth", authRoutes);


/**
 * Interview Routes
 *
 * Registers all interview-report-related endpoints.
 *
 * Base URL:
 * /api/interview
 *
 * Example endpoints:
 *
 * POST /api/interview
 * GET  /api/interview/reports
 * GET  /api/interview/reports/my
 * GET  /api/interview/reports/:interviewId
 *
 * The actual route definitions are maintained
 * inside `interviewRoutes`.
 */
app.use("/api/interview", interviewRoutes);


// ======================================================
// EXPORT APPLICATION
// ======================================================

/**
 * Export the Express application.
 *
 * The application is imported by the server entry point,
 * where the HTTP server is started using `app.listen()`.
 *
 * Example:
 *
 * import app from "./app.js";
 *
 * app.listen(3000, () => {
 *     console.log("Server running on port 3000");
 * });
 */
export default app;