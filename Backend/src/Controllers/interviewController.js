import { PDFParse } from "pdf-parse";
import generateInterviewReport from "../services/AIService.js";
import interviewReportModel from "../Models/interviewReportModel.js";


// ======================================================
// Generate Interview Report
// ======================================================

/**
 * @route   POST /api/interview
 * @desc    Generate an AI-powered interview report from a
 *          candidate's resume, self-description, and job description.
 * @access  Private
 *
 * @middleware
 * - authUser: Verifies that the user is authenticated.
 * - uploadFile.single("resume"): Uploads the candidate's resume PDF.
 *
 * @body
 * - selfDescription {String} Candidate's self-description.
 * - jobDescription {String} Description of the target job.
 *
 * @file
 * - resume {File} Candidate's resume in PDF format.
 *
 * @process
 * 1. Validates the uploaded resume.
 * 2. Validates self-description and job description.
 * 3. Extracts text from the uploaded PDF.
 * 4. Sends resume and job information to the AI service.
 * 5. Creates and stores the generated interview report.
 * 6. Returns the generated report.
 *
 * @returns {Object}
 * - success {Boolean}
 * - message {String}
 * - interviewReport {Object} Generated interview report.
 *
 * @throws {400}
 * Resume, self-description, or job description is missing.
 *
 * @throws {500}
 * Error while processing the resume, generating the report,
 * or saving the report to the database.
 */
const generateInterviewReportController = async (req, res) => {
  try {
    // Check resume file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    // Get request data
    const { selfDescription, jobDescription } = req.body;

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Self description and job description are required",
      });
    }

    // Resume file
    const resumeFile = req.file;

    // Extract PDF content
    const parser = new PDFParse({
      data: resumeFile.buffer,
    });

    const pdfData = await parser.getText();
    const resumeContent = pdfData.text;

    if (!resumeContent || !resumeContent.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume PDF",
      });
    }

    // Generate AI report
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    // Save report
    const interviewReport = await interviewReportModel.create({
      users: req.user._id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(201).json({
      success: true,
      message: "Report Created Successfully",
      interviewReport,
    });

  } catch (error) {
    console.error("Interview Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate interview report",
      error: error.message,
    });
  }
};


// ======================================================
// Get All Interview Reports
// ======================================================

/**
 * @route   GET /api/interview/reports
 * @desc    Retrieve all interview reports stored in the database.
 * @access  Private / Admin
 *
 * @middleware
 * - authUser: Verifies that the user is authenticated.
 *
 * @process
 * 1. Retrieves all interview reports from MongoDB.
 * 2. Populates the associated user's username and email.
 * 3. Sorts reports by creation date in descending order.
 * 4. Returns all reports along with the total count.
 *
 * @returns {Object}
 * - success {Boolean}
 * - message {String}
 * - count {Number} Total number of reports.
 * - interviewReports {Array} List of interview reports.
 *
 * @throws {500}
 * Error while retrieving reports from the database.
 */
const getAllInterviewReportsController = async (req, res) => {
  try {
    const interviewReports = await interviewReportModel
      .find()
      .populate("users", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Interview reports fetched successfully",
      count: interviewReports.length,
      interviewReports,
    });

  } catch (error) {
    console.error("Get All Interview Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview reports",
      error: error.message,
    });
  }
};


// ======================================================
// Get Interview Reports For Logged-In User
// ======================================================

/**
 * @route   GET /api/interview/reports/my
 * @desc    Retrieve all interview reports created by the
 *          currently authenticated user.
 * @access  Private
 *
 * @middleware
 * - authUser: Verifies that the user is authenticated.
 *
 * @process
 * 1. Gets the authenticated user's ID from req.user.
 * 2. Searches the database for reports belonging to that user.
 * 3. Sorts reports by creation date in descending order.
 * 4. Returns the user's reports along with the total count.
 *
 * @returns {Object}
 * - success {Boolean}
 * - message {String}
 * - count {Number} Number of reports belonging to the user.
 * - interviewReports {Array} User's interview reports.
 *
 * @throws {500}
 * Error while retrieving the user's reports from the database.
 */
const getUserInterviewReportsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const interviewReports = await interviewReportModel
      .find({ users: userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User interview reports fetched successfully",
      count: interviewReports.length,
      interviewReports,
    });

  } catch (error) {
    console.error("Get User Interview Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user interview reports",
      error: error.message,
    });
  }
};


// ======================================================
// Get Interview Report By ID
// ======================================================

/**
 * @route   GET /api/interview/reports/:interviewId
 * @desc    Retrieve a specific interview report using its ID.
 * @access  Private
 *
 * @middleware
 * - authUser: Verifies that the user is authenticated.
 *
 * @params
 * - interviewId {String} MongoDB ID of the interview report.
 *
 * @process
 * 1. Extracts the interview report ID from the URL.
 * 2. Searches MongoDB for the report.
 * 3. Populates the associated user's username and email.
 * 4. Returns the complete interview report.
 *
 * @returns {Object}
 * - success {Boolean}
 * - message {String}
 * - interviewReport {Object} Requested interview report.
 *
 * @throws {404}
 * Interview report does not exist.
 *
 * @throws {500}
 * Error while retrieving the report from the database.
 */
const getInterviewReportByIdController = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel
      .findById(interviewId)
      .populate("users", "username email");

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview report fetched successfully",
      interviewReport,
    });

  } catch (error) {
    console.error("Get Interview Report By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview report",
      error: error.message,
    });
  }
};


// ======================================================
// Export Controllers
// ======================================================

export default {
  generateInterviewReportController,
  getAllInterviewReportsController,
  getUserInterviewReportsController,
  getInterviewReportByIdController,
};