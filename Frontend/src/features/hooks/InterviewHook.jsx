import { useContext } from "react";

import { interviewContext } from "../Contexts/InterviewContext";

import {
  generateInterviewReport,
  getAllInterviewReports,
  getMyInterviewReports,
  getInterviewReportById,
} from "../../APIs/InterviewReportAPI.JS";

/**
 * Custom hook for managing interview report operations.
 *
 * This hook provides access to the Interview Context and exposes
 * functions for:
 * - Generating a new interview report
 * - Fetching all interview reports
 * - Fetching reports belonging to the logged-in user
 * - Fetching a specific interview report by ID
 *
 * It also manages the shared loading, report, and reports state
 * provided by InterviewContext.
 *
 * @returns {{
 *   loading: boolean,
 *   report: Object|null,
 *   allReports: Array,
 *   handleGenerateInterviewReport: Function,
 *   handleGetAllInterviewReports: Function,
 *   handleGetMyInterviewReports: Function,
 *   handleGetInterviewReportById: Function
 * }}
 *
 * @throws {Error}
 * Throws an error if the hook is used outside
 * InterviewContextProvider.
 */
export const useInterview = () => {
  /**
   * Access the Interview Context.
   *
   * The context contains the shared state and setter functions
   * required for managing interview reports.
   */
  const context = useContext(interviewContext);

  /**
   * Prevent the hook from being used outside
   * InterviewContextProvider.
   */
  if (!context) {
    throw new Error(
      "useInterview must be used inside an InterviewContextProvider",
    );
  }

  /**
   * Extract required state and setter functions
   * from the Interview Context.
   */
  const { loading, setLoading, report, setReport, allReports, setAllReports } =
    context;

  /**
   * Generates an interview report using the provided
   * job description, self-description, and resume.
   *
   * @param {Object} data - Interview information.
   * @param {string} data.jobDescription - Target job description.
   * @param {string} data.selfDescription - Candidate's self-description.
   * @param {File} data.resumeFile - Candidate's uploaded resume.
   *
   * @returns {Promise<Object>} Generated interview report response.
   *
   * @throws {Error} If report generation fails.
   */
  const handleGenerateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    try {
      // Start loading state before making the API request.
      setLoading(true);

      /**
       * Send candidate information to the backend.
       */
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      /**
       * Store the newly generated report
       * in the global Interview Context.
       */
      setReport(response.interviewReport);

      // Return the complete API response to the component.
      return response;
    } catch (error) {
      /**
       * Log useful backend/API error information
       * for debugging purposes.
       */
      console.error(
        "Generate Interview Report Error:",
        error.response?.data || error.message,
      );

      // Re-throw the error so the component can handle it.
      throw error;
    } finally {
      // Always stop loading after the request finishes.
      setLoading(false);
    }
  };

  /**
   * Fetches all interview reports from the backend.
   *
   * This function is generally useful for administrative
   * or dashboard views where all available reports are required.
   *
   * @returns {Promise<Object>} API response containing interview reports.
   *
   * @throws {Error} If fetching reports fails.
   */
  const handleGetAllInterviewReports = async () => {
    try {
      // Start loading state.
      setLoading(true);

      /**
       * Request all interview reports from the API.
       */
      const response = await getAllInterviewReports();

      /**
       * Store reports in context.
       *
       * The fallback [] prevents undefined values from
       * being stored if the API does not return interviewReports.
       */
      setAllReports(response.interviewReports || []);

      // Return the complete API response.
      return response;
    } catch (error) {
      /**
       * Log backend/API error details.
       */
      console.error(
        "Get All Interview Reports Error:",
        error.response?.data || error.message,
      );

      // Re-throw so the calling component can handle the error.
      throw error;
    } finally {
      // Stop loading regardless of success or failure.
      setLoading(false);
    }
  };

  /**
   * Fetches interview reports belonging to the
   * currently authenticated user.
   *
   * This function is normally used on the user's dashboard
   * or interview history page.
   *
   * @returns {Promise<Object>} API response containing user's reports.
   *
   * @throws {Error} If fetching user reports fails.
   */
  const handleGetMyInterviewReports = async () => {
    try {
      // Start loading state.
      setLoading(true);

      /**
       * Request reports associated with the
       * currently authenticated user.
       */
      const response = await getMyInterviewReports();

      /**
       * Store the user's reports in global context.
       *
       * Use an empty array as a safe fallback.
       */
      setAllReports(response.interviewReports || []);

      // Return the complete API response.
      return response;
    } catch (error) {
      /**
       * Log backend/API error details.
       */
      console.error(
        "Get My Interview Reports Error:",
        error.response?.data || error.message,
      );

      // Re-throw so the UI can display an appropriate error.
      throw error;
    } finally {
      // Stop loading after the request completes.
      setLoading(false);
    }
  };

  /**
   * Fetches a single interview report using its MongoDB ID.
   *
   * @param {string} interviewId - Unique ID of the interview report.
   *
   * @returns {Promise<Object>} API response containing the report.
   *
   * @throws {Error} If interviewId is missing or the API request fails.
   */
  const handleGetInterviewReportById = async (interviewId) => {
    try {
      /**
       * Validate the report ID before making
       * an unnecessary API request.
       */
      if (!interviewId) {
        throw new Error("Interview report ID is required.");
      }

      // Start loading state.
      setLoading(true);

      /**
       * Request the specific interview report.
       */
      const response = await getInterviewReportById(interviewId);

      /**
       * Store the fetched report in global context.
       */
      setReport(response.interviewReport);

      // Return the complete API response.
      return response;
    } catch (error) {
      /**
       * Log backend/API error information.
       */
      console.error(
        "Get Interview Report By ID Error:",
        error.response?.data || error.message,
      );

      // Re-throw so the component can handle the error.
      throw error;
    } finally {
      // Stop loading after the request completes.
      setLoading(false);
    }
  };

  /**
   * Expose state and interview operations
   * to components using the useInterview hook.
   */
  return {
    loading,
    report,
    allReports,

    handleGenerateInterviewReport,
    handleGetAllInterviewReports,
    handleGetMyInterviewReports,
    handleGetInterviewReportById,
  };
};
