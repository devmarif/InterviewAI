import mongoose from "mongoose";

/**
 * Technical Question Schema
 *
 * Stores technical interview questions along with the purpose
 * of the question and its expected answer.
 *
 * `_id: false` prevents Mongoose from generating a separate
 * ObjectId for each technical question.
 */
const technicalQuestionSchema = new mongoose.Schema(
    {
        /**
         * Technical interview question.
         *
         * @type {String}
         * @required
         */
        question: {
            type: String,
            required: [true, "Question is required"],
            trim: true,
        },

        /**
         * Explains what the question is intended to evaluate.
         *
         * @type {String}
         * @required
         */
        intention: {
            type: String,
            required: [true, "Question intention is required"],
            trim: true,
        },

        /**
         * Expected or suggested answer for the question.
         *
         * @type {String}
         * @required
         */
        answer: {
            type: String,
            required: [true, "Answer is required"],
            trim: true,
        },
    },
    { _id: false },
);

/**
 * Behavioral Question Schema
 *
 * Stores behavioral interview questions, their purpose,
 * and suggested answers.
 *
 * `_id: false` prevents Mongoose from generating a separate
 * ObjectId for each behavioral question.
 */
const behavioralQuestionSchema = new mongoose.Schema(
    {
        /**
         * Behavioral interview question.
         *
         * @type {String}
         * @required
         */
        question: {
            type: String,
            required: [true, "Question is required"],
            trim: true,
        },

        /**
         * Explains what the question is intended to evaluate,
         * such as communication, leadership, teamwork, etc.
         *
         * @type {String}
         * @required
         */
        intention: {
            type: String,
            required: [true, "Question intention is required"],
            trim: true,
        },

        /**
         * Expected or suggested answer for the question.
         *
         * @type {String}
         * @required
         */
        answer: {
            type: String,
            required: [true, "Answer is required"],
            trim: true,
        },
    },
    { _id: false },
);

/**
 * Skills Gap Schema
 *
 * Represents a skill that the candidate needs to improve
 * based on the comparison between their resume/profile
 * and the job description.
 */
const skillsGapSchema = new mongoose.Schema(
    {
        /**
         * Name of the skill that needs improvement.
         *
         * @type {String}
         * @required
         */
        skill: {
            type: String,
            required: [true, "Skill is required"],
            trim: true,
        },

        /**
         * Indicates how important the skill gap is.
         *
         * Allowed values:
         * - low
         * - medium
         * - high
         *
         * @type {String}
         * @enum {"low"|"medium"|"high"}
         * @required
         */
        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            required: [true, "Severity is required"],
        },
    },
    { _id: false },
);

/**
 * Preparation Plan Schema
 *
 * Represents an individual day in the candidate's
 * interview preparation plan.
 */
const preparationPlanSchema = new mongoose.Schema(
    {
        /**
         * Day or time period for the preparation activity.
         *
         * @type {String}
         * @required
         */
        day: {
            type: String,
            required: [true, "Day is required"],
        },

        /**
         * Main topic or objective for the day.
         *
         * @type {String}
         * @required
         */
        focus: {
            type: String,
            required: [true, "Focus is required"],
            trim: true,
        },

        /**
         * List of tasks the candidate should complete.
         *
         * @type {String[]}
         * @required
         */
        tasks: {
            type: [String],
            required: [true, "Tasks are required"],
        },
    },
    { _id: false },
);

/**
 * Main Interview Report Schema
 *
 * Stores the complete AI-generated interview analysis
 * for a candidate.
 *
 * The report contains:
 * - Job description
 * - Candidate resume
 * - Candidate self-description
 * - Match score
 * - Technical interview questions
 * - Behavioral interview questions
 * - Skills gaps
 * - Interview preparation plan
 * - Associated user
 *
 * Automatic timestamps are enabled, so Mongoose adds:
 * - createdAt
 * - updatedAt
 */
const interviewReportSchema = new mongoose.Schema(
    {
        /**
         * Job description against which the candidate
         * is being evaluated.
         *
         * @type {String}
         * @required
         */
        jobDescription: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
        },

        /**
         * Candidate's resume content or resume reference.
         *
         * @type {String}
         * @optional
         */
        resume: {
            type: String,
            trim: true,
        },

        /**
         * Candidate's self-description.
         *
         * This information is used by the AI to better
         * understand the candidate's background and goals.
         *
         * @type {String}
         * @required
         */
        selfDescription: {
            type: String,
            required: [true, "Self description is required"],
            trim: true,
        },

        /**
         * Overall compatibility score between the candidate
         * and the provided job description.
         *
         * Value must be between 0 and 100.
         *
         * @type {Number}
         * @min 0
         * @max 100
         */
        matchScore: {
            type: Number,
            min: [0, "Match score cannot be less than 0"],
            max: [100, "Match score cannot be greater than 100"],
        },

        /**
         * List of AI-generated technical interview questions.
         *
         * @type {Array}
         * @default []
         */
        technicalQuestions: {
            type: [technicalQuestionSchema],
            default: [],
        },

        /**
         * List of AI-generated behavioral interview questions.
         *
         * @type {Array}
         * @default []
         */
        behavioralQuestions: {
            type: [behavioralQuestionSchema],
            default: [],
        },

        /**
         * Skills that the candidate should improve
         * before attending the interview.
         *
         * @type {Array}
         * @default []
         */
        skillsGap: {
            type: [skillsGapSchema],
            default: [],
        },

        /**
         * Personalized interview preparation plan.
         *
         * @type {Array}
         * @default []
         */
        preparationPlan: {
            type: [preparationPlanSchema],
            default: [],
        },

        /**
         * Reference to the user who owns this interview report.
         *
         * Uses MongoDB ObjectId and references the `users` collection.
         *
         * This allows the report to be associated with a
         * specific authenticated user.
         *
         * @type {mongoose.Schema.Types.ObjectId}
         * @ref users
         */
        users: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    },

    /**
     * Automatically creates `createdAt` and `updatedAt`
     * fields for every interview report.
     */
    {
        timestamps: true,
    },
);

/**
 * Interview Report Model
 *
 * Creates the Mongoose model using the InterviewReport schema.
 *
 * @constant
 */
const interviewReportModel = mongoose.model(
    "InterviewReport",
    interviewReportSchema,
);

/**
 * Export the Interview Report model.
 *
 * This model can be used to:
 * - Create interview reports
 * - Find reports
 * - Find reports belonging to a specific user
 * - Update reports
 * - Delete reports
 * - Populate the associated user
 */
export default interviewReportModel;