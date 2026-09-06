import { Router } from "express";
import uploadFile from "../Middlewares/FileMiddleWare.js";
import AuthMiddleWare from "../Middlewares/AuthMiddleWare.js";
import interviewController from "../Controllers/interviewController.js";

/**
 * Express Router for Interview Report APIs.
 *
 * Handles:
 * - Generating AI-powered interview reports
 * - Fetching all interview reports
 * - Fetching reports belonging to the logged-in user
 * - Fetching an individual interview report
 *
 * Base URL:
 * /api/interview
 */
const interviewRoutes = Router();

/**
 * Generate Interview Report
 *
 * Creates an AI-powered interview report using:
 * - Job description
 * - Candidate self-description
 * - Uploaded resume
 *
 * Authentication is required before processing the request.
 * The resume is uploaded using Multer's `single()` middleware.
 *
 * HTTP Method: POST
 * Endpoint: /api/interview
 *
 * Middleware:
 * 1. `authUser`
 *    - Verifies that the user is authenticated.
 *
 * 2. `uploadFile.single("resume")`
 *    - Accepts a single resume file.
 *    - The uploaded file is available through `req.file`.
 *
 * 3. `generateInterviewReportController`
 *    - Processes the resume and generates the interview report.
 *
 * Request:
 * - Content-Type: multipart/form-data
 * - resume: PDF resume file
 * - jobDescription: Job description
 * - selfDescription: Candidate's description
 *
 * Response:
 * - Returns the generated interview report.
 */
interviewRoutes.post(
    "/",
    AuthMiddleWare.authUser,
    uploadFile.single("resume"),
    interviewController.generateInterviewReportController
);


/**
 * Get All Interview Reports
 *
 * Retrieves all interview reports stored in the database.
 *
 * HTTP Method: GET
 * Endpoint: /api/interview/reports
 *
 * Middleware:
 * - `authUser`
 *   Ensures that only authenticated users can access
 *   the interview reports.
 *
 * Controller:
 * - `getAllInterviewReportsController`
 *
 * Response:
 * - Returns a list of interview reports.
 */
interviewRoutes.get(
    "/reports",
    AuthMiddleWare.authUser,
    interviewController.getAllInterviewReportsController
);


/**
 * Get Logged-in User's Interview Reports
 *
 * Retrieves only the interview reports that belong to
 * the currently authenticated user.
 *
 * HTTP Method: GET
 * Endpoint: /api/interview/reports/my
 *
 * Middleware:
 * - `authUser`
 *   Verifies the authenticated user.
 *
 * Controller:
 * - `getUserInterviewReportsController`
 *
 * Response:
 * - Returns reports associated with `req.user`.
 *
 * Important:
 * This route must be declared BEFORE `/reports/:interviewId`.
 *
 * Otherwise, Express may interpret "my" as an `interviewId`.
 */
interviewRoutes.get(
    "/reports/my",
    AuthMiddleWare.authUser,
    interviewController.getUserInterviewReportsController
);


/**
 * Get Interview Report By ID
 *
 * Retrieves a single interview report using its MongoDB
 * document ID.
 *
 * HTTP Method: GET
 * Endpoint: /api/interview/reports/:interviewId
 *
 * URL Parameter:
 * - interviewId: MongoDB ObjectId of the interview report.
 *
 * Middleware:
 * - `authUser`
 *   Ensures that the request is made by an authenticated user.
 *
 * Controller:
 * - `getInterviewReportByIdController`
 *
 * Example:
 * GET /api/interview/reports/65f123abc456def789012345
 *
 * Response:
 * - Returns the requested interview report.
 */
interviewRoutes.get(
    "/reports/:interviewId",
    AuthMiddleWare.authUser,
    interviewController.getInterviewReportByIdController
);


/**
 * Export Interview Routes
 *
 * This router should be mounted in the main Express application
 * using:
 *
 * app.use("/api/interview", interviewRoutes);
 */
export default interviewRoutes;