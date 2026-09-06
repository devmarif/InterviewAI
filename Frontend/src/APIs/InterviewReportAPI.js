import axios from "axios";

const API_URL = "http://localhost:3000/api/interview";

/**
 * Generate an AI-powered interview report.
 *
 * Sends the candidate's resume, self-description, and target
 * job description to the backend using multipart/form-data.
 *
 * @async
 * @function generateInterviewReport
 *
 * @param {Object} data - Interview report input data.
 * @param {string} data.jobDescription - Target job description.
 * @param {string} data.selfDescription - Candidate's self-description.
 * @param {File} data.resumeFile - Candidate's resume PDF file.
 *
 * @returns {Promise<Object>} API response containing the generated
 * interview report.
 *
 * @throws {Error} Throws an error if the request fails.
 *
 * @endpoint POST /api/interview
 */
export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
}) => {
    try {
        const formData = new FormData();

        formData.append("jobDescription", jobDescription);
        formData.append("selfDescription", selfDescription);
        formData.append("resume", resumeFile);

        const response = await axios.post(`${API_URL}`, formData, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error(
            "Generate Interview Report API Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


/**
 * Get all interview reports.
 *
 * Retrieves all interview reports stored in the database.
 * The request requires an authenticated user.
 *
 * @async
 * @function getAllInterviewReports
 *
 * @returns {Promise<Object>} API response containing:
 * - success {boolean}
 * - message {string}
 * - count {number}
 * - interviewReports {Array}
 *
 * @throws {Error} Throws an error if the request fails.
 *
 * @endpoint GET /api/interview/reports
 */
export const getAllInterviewReports = async () => {
    try {
        const response = await axios.get(`${API_URL}/reports`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error(
            "Get All Interview Reports API Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


/**
 * Get all interview reports belonging to the
 * currently authenticated user.
 *
 * The backend identifies the user using the authentication
 * cookie/session and returns only that user's reports.
 *
 * @async
 * @function getMyInterviewReports
 *
 * @returns {Promise<Object>} API response containing:
 * - success {boolean}
 * - message {string}
 * - count {number}
 * - interviewReports {Array}
 *
 * @throws {Error} Throws an error if the request fails.
 *
 * @endpoint GET /api/interview/reports/my
 */
export const getMyInterviewReports = async () => {
    try {
        const response = await axios.get(`${API_URL}/reports/my`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error(
            "Get My Interview Reports API Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


/**
 * Get a specific interview report by its ID.
 *
 * Retrieves the complete interview report associated
 * with the provided MongoDB document ID.
 *
 * @async
 * @function getInterviewReportById
 *
 * @param {string} interviewId - MongoDB ID of the interview report.
 *
 * @returns {Promise<Object>} API response containing:
 * - success {boolean}
 * - message {string}
 * - interviewReport {Object}
 *
 * @throws {Error} Throws an error if the request fails
 * or the interview report does not exist.
 *
 * @endpoint GET /api/interview/reports/:interviewId
 */
export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await axios.get(
            `${API_URL}/reports/${interviewId}`,
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get Interview Report By ID API Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};