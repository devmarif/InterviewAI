import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

// ======================================================
// GEMINI INITIALIZATION
// ======================================================

/**
 * Initializes the Google Gemini AI client.
 *
 * The API key is loaded from the environment variables
 * using `dotenv/config`.
 *
 * Required environment variable:
 *
 * GEMINI_API_KEY=your_gemini_api_key
 */
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


// ======================================================
// ZOD SCHEMA
// ======================================================

/**
 * Zod validation schema for the generated interview report.
 *
 * This schema validates the structure and data types of the
 * response returned by Gemini before the report is stored
 * in the database.
 *
 * The report contains:
 * - Match score
 * - Technical questions
 * - Behavioral questions
 * - Skills gaps
 * - Preparation plan
 */
const interviewReportSchema = z.object({

    // --------------------------------------------------
    // MATCH SCORE
    // --------------------------------------------------

    /**
     * Overall candidate-to-job compatibility score.
     *
     * The value must be between 0 and 100.
     */
    matchScore: z
        .number()
        .min(0)
        .max(100),


    // --------------------------------------------------
    // TECHNICAL QUESTIONS
    // --------------------------------------------------

    /**
     * AI-generated technical interview questions.
     *
     * Each question contains:
     * - question
     * - intention
     * - answer
     */
    technicalQuestions: z.array(

        z.object({

            /**
             * Technical interview question.
             */
            question: z
                .string()
                .min(1),

            /**
             * Explains what the interviewer is evaluating.
             */
            intention: z
                .string()
                .min(1),

            /**
             * Suggested or sample answer.
             */
            answer: z
                .string()
                .min(1),

        })

    ),


    // --------------------------------------------------
    // BEHAVIORAL QUESTIONS
    // --------------------------------------------------

    /**
     * AI-generated behavioral interview questions.
     *
     * Each question contains:
     * - question
     * - intention
     * - answer
     */
    behavioralQuestions: z.array(

        z.object({

            /**
             * Behavioral interview question.
             */
            question: z
                .string()
                .min(1),

            /**
             * Explains what the interviewer wants to evaluate.
             */
            intention: z
                .string()
                .min(1),

            /**
             * Suggested sample answer.
             */
            answer: z
                .string()
                .min(1),

        })

    ),


    // --------------------------------------------------
    // SKILLS GAP
    // --------------------------------------------------

    /**
     * Skills that are missing, weak, or insufficiently
     * demonstrated by the candidate.
     */
    skillsGap: z.array(

        z.object({

            /**
             * Name of the missing or weak skill.
             */
            skill: z
                .string()
                .min(1),

            /**
             * Importance of the identified skill gap.
             *
             * Allowed values:
             * - low
             * - medium
             * - high
             */
            severity: z
                .enum([
                    "low",
                    "medium",
                    "high",
                ]),

            /**
             * Reason why the skill is considered a gap.
             */
            reason: z
                .string()
                .min(1),

            /**
             * Recommendation for improving the skill.
             */
            recommendation: z
                .string()
                .min(1),

        })

    ),


    // --------------------------------------------------
    // PREPARATION PLAN
    // --------------------------------------------------

    /**
     * Personalized interview preparation plan.
     *
     * Each preparation period contains:
     * - day
     * - focus
     * - tasks
     */
    preparationPlan: z.array(

        z.object({

            /**
             * Day or preparation period.
             */
            day: z
                .string()
                .min(1),

            /**
             * Main preparation topic.
             */
            focus: z
                .string()
                .min(1),

            /**
             * Specific tasks to complete.
             */
            tasks: z.array(
                z.string().min(1)
            ),

        })

    ),

});


// ======================================================
// GEMINI JSON SCHEMA
// ======================================================

/**
 * JSON schema provided to Gemini.
 *
 * This schema instructs Gemini to return the interview
 * analysis in a predictable JSON structure.
 *
 * `responseMimeType` and `responseJsonSchema` are used
 * when making the Gemini API request.
 */
const responseSchema = {

    type: "object",

    properties: {

        // ==================================================
        // MATCH SCORE
        // ==================================================

        /**
         * Overall percentage match between the candidate
         * and the job description.
         */
        matchScore: {

            type: "number",

            minimum: 0,

            maximum: 100,

            description:
                "Overall percentage match between the candidate and the job description.",

        },


        // ==================================================
        // TECHNICAL QUESTIONS
        // ==================================================

        /**
         * Technical questions generated from the candidate's
         * resume, skills, projects, experience, and job description.
         */
        technicalQuestions: {

            type: "array",

            description:
                "Technical interview questions based on the job description, resume, skills, projects and experience.",

            items: {

                type: "object",

                properties: {

                    /**
                     * Technical interview question.
                     */
                    question: {

                        type: "string",

                        description:
                            "The technical interview question.",

                    },

                    /**
                     * Purpose of the technical question.
                     */
                    intention: {

                        type: "string",

                        description:
                            "What the interviewer is trying to evaluate with this question.",

                    },

                    /**
                     * Strong sample answer.
                     */
                    answer: {

                        type: "string",

                        description:
                            "A strong sample answer that the candidate can use for interview preparation.",

                    },

                },

                required: [

                    "question",
                    "intention",
                    "answer",

                ],

            },

        },


        // ==================================================
        // BEHAVIORAL QUESTIONS
        // ==================================================

        /**
         * Behavioral interview questions based on the
         * candidate's experience and job requirements.
         */
        behavioralQuestions: {

            type: "array",

            description:
                "Behavioral interview questions based on the candidate's experience and the job requirements.",

            items: {

                type: "object",

                properties: {

                    /**
                     * Behavioral interview question.
                     */
                    question: {

                        type: "string",

                        description:
                            "The behavioral interview question.",

                    },

                    /**
                     * Purpose of the behavioral question.
                     */
                    intention: {

                        type: "string",

                        description:
                            "What the interviewer is trying to evaluate.",

                    },

                    /**
                     * Suggested sample answer.
                     */
                    answer: {

                        type: "string",

                        description:
                            "A strong sample answer using the STAR method where appropriate.",

                    },

                },

                required: [

                    "question",
                    "intention",
                    "answer",

                ],

            },

        },


        // ==================================================
        // SKILLS GAP
        // ==================================================

        /**
         * Skills that are missing or insufficiently
         * demonstrated by the candidate.
         */
        skillsGap: {

            type: "array",

            description:
                "Skills missing or insufficiently demonstrated by the candidate compared with the job requirements.",

            items: {

                type: "object",

                properties: {

                    /**
                     * Missing or weak skill.
                     */
                    skill: {

                        type: "string",

                        description:
                            "The skill that is missing or needs improvement.",

                    },

                    /**
                     * Severity of the skill gap.
                     */
                    severity: {

                        type: "string",

                        enum: [

                            "low",
                            "medium",
                            "high",

                        ],

                        description:
                            "Importance of the skill gap.",

                    },

                    /**
                     * Explanation for the identified gap.
                     */
                    reason: {

                        type: "string",

                        description:
                            "Why this skill is considered a gap.",

                    },

                    /**
                     * Recommended improvement strategy.
                     */
                    recommendation: {

                        type: "string",

                        description:
                            "How the candidate can improve this skill.",

                    },

                },

                required: [

                    "skill",
                    "severity",
                    "reason",
                    "recommendation",

                ],

            },

        },


        // ==================================================
        // PREPARATION PLAN
        // ==================================================

        /**
         * Personalized preparation plan based on the
         * candidate's weaknesses and job requirements.
         */
        preparationPlan: {

            type: "array",

            description:
                "A practical interview preparation plan based on the candidate's weaknesses and job requirements.",

            items: {

                type: "object",

                properties: {

                    /**
                     * Preparation day or time period.
                     */
                    day: {

                        type: "string",

                        description:
                            "The day or time period for the preparation task.",

                    },

                    /**
                     * Main topic for the preparation period.
                     */
                    focus: {

                        type: "string",

                        description:
                            "Main preparation focus for this day.",

                    },

                    /**
                     * Specific preparation activities.
                     */
                    tasks: {

                        type: "array",

                        description:
                            "Specific preparation tasks.",

                        items: {

                            type: "string",

                        },

                    },

                },

                required: [

                    "day",
                    "focus",
                    "tasks",

                ],

            },

        },

    },


    // ==================================================
    // REQUIRED ROOT PROPERTIES
    // ==================================================

    /**
     * Required properties that Gemini must return
     * in the root JSON object.
     */
    required: [

        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillsGap",
        "preparationPlan",

    ],

};


// ======================================================
// GENERATE INTERVIEW REPORT
// ======================================================

/**
 * Generates an AI-powered interview preparation report.
 *
 * The function sends the candidate's resume,
 * self-description, and target job description to Gemini.
 *
 * Gemini analyzes the provided information and generates:
 *
 * - Candidate-job match score
 * - Technical interview questions
 * - Behavioral interview questions
 * - Skills gaps
 * - Personalized preparation plan
 *
 * The generated response is then:
 *
 * 1. Checked for empty output
 * 2. Parsed as JSON
 * 3. Validated using Zod
 * 4. Returned to the controller
 *
 * @param {Object} data - Interview analysis input.
 * @param {String} data.resume - Candidate resume content.
 * @param {String} data.selfDescription - Candidate's self-description.
 * @param {String} data.jobDescription - Target job description.
 *
 * @returns {Promise<Object>} Validated interview report.
 *
 * @throws {Error} If required input is missing.
 * @throws {Error} If Gemini returns an empty response.
 * @throws {Error} If Gemini returns invalid JSON.
 * @throws {ZodError} If Gemini's response does not match
 * the expected report structure.
 */
const generateInterviewReport = async ({

    resume,

    selfDescription,

    jobDescription,

}) => {

    try {

        // ==================================================
        // VALIDATE INPUT
        // ==================================================

        /**
         * Ensure a resume was provided before calling Gemini.
         */
        if (!resume) {

            throw new Error(
                "Resume is required."
            );

        }

        /**
         * Ensure the candidate's self-description exists.
         */
        if (!selfDescription) {

            throw new Error(
                "Self description is required."
            );

        }

        /**
         * Ensure the target job description exists.
         */
        if (!jobDescription) {

            throw new Error(
                "Job description is required."
            );

        }


        // ==================================================
        // PROMPT
        // ==================================================

        /**
         * Prompt instructions sent to Gemini.
         *
         * The prompt strictly limits Gemini to information
         * provided by the candidate and the job description.
         *
         * It also defines the required output structure,
         * question counts, skill-gap analysis, and preparation
         * plan.
         */
        const prompt = `

You are an expert technical recruiter, interviewer,
career coach and resume evaluator.

Your task is to analyze the candidate against the
provided job description and create a detailed
interview preparation report.

You MUST ONLY use information provided in:

1. Resume
2. Candidate self-description
3. Job description

Do NOT invent:

- skills
- projects
- companies
- experience
- certifications
- achievements
- technologies
- education
- responsibilities

If something is not mentioned, treat it as unknown.


==================================================
CANDIDATE RESUME
==================================================

${resume}


==================================================
CANDIDATE SELF DESCRIPTION
==================================================

${selfDescription}


==================================================
JOB DESCRIPTION
==================================================

${jobDescription}


==================================================
ANALYSIS REQUIREMENTS
==================================================


1. MATCH SCORE
==================================================

Calculate an overall candidate-job match score
between 0 and 100.

Consider:

- required technical skills
- preferred technical skills
- years of experience
- projects
- education
- responsibilities
- domain knowledge
- tools and technologies
- candidate's self-described strengths

The score must be realistic.

Do not give a high score simply because the candidate
has some matching keywords.

The matchScore MUST be a number between 0 and 100.


==================================================
2. TECHNICAL QUESTIONS
==================================================

Generate technical interview questions relevant to
the job.

Questions should be based on:

- technologies in the job description
- technologies in the resume
- candidate projects
- candidate experience
- important job responsibilities
- identified technical weaknesses

For EVERY technical question generate:

question:
The actual interview question.

intention:
Explain what the interviewer is testing.

answer:
Provide a strong sample answer.

Each item MUST be an object.

Example:

{
    "question": "Explain how JWT authentication works.",
    "intention": "Tests understanding of authentication and authorization.",
    "answer": "JWT authentication works by..."
}

Generate approximately 8-12 technical questions.


==================================================
3. BEHAVIORAL QUESTIONS
==================================================

Generate behavioral interview questions relevant
to the candidate and job.

Consider:

- candidate experience
- teamwork
- leadership
- communication
- conflict
- problem solving
- failure
- deadlines
- challenges
- responsibility

For EVERY behavioral question generate:

question:
The actual behavioral question.

intention:
What the interviewer wants to evaluate.

answer:
A strong sample answer.

Use the STAR approach where appropriate:

Situation
Task
Action
Result

Each item MUST be an object.

Example:

{
    "question": "Tell me about a challenging project you worked on.",
    "intention": "Evaluates problem solving and ownership.",
    "answer": "Situation: ... Task: ... Action: ... Result: ..."
}

Generate approximately 5-8 behavioral questions.


==================================================
4. SKILLS GAP
==================================================

Compare the candidate's current skills against
the requirements of the job.

Identify:

- missing skills
- weak skills
- insufficiently demonstrated skills
- important technologies not present in the resume

For EVERY skill gap generate:

skill:
The missing or weak skill.

severity:
Must be exactly one of:

low
medium
high

reason:
Explain why this is considered a gap.

recommendation:
Explain how the candidate should improve it.

Do NOT claim something is missing if the candidate
clearly demonstrates that skill.

Example:

{
    "skill": "Docker",
    "severity": "medium",
    "reason": "Docker is mentioned in the job description but is not demonstrated in the resume.",
    "recommendation": "Learn Docker fundamentals and containerize a small backend project."
}


==================================================
5. PREPARATION PLAN
==================================================

Create a practical preparation plan.

The plan should focus on:

- technical weaknesses
- behavioral preparation
- job-specific technologies
- resume-based questions
- skills gaps

For every preparation period provide:

day:
Example: "Day 1"

focus:
Main topic.

tasks:
An array of specific preparation tasks.

Example:

{
    "day": "Day 1",
    "focus": "JavaScript fundamentals",
    "tasks": [
        "Review closures",
        "Practice promises",
        "Solve 5 JavaScript problems"
    ]
}

Create approximately 5-7 preparation days.


==================================================
IMPORTANT OUTPUT RULES
==================================================

Return ONLY valid JSON.

Do NOT return:

- Markdown
- code fences
- explanations outside JSON
- comments
- headings
- introductory text

The response MUST exactly follow the provided JSON schema.


==================================================
IMPORTANT FIELD NAMES
==================================================

Use EXACTLY these field names.

Technical questions:

"question"
"intention"
"answer"

Behavioral questions:

"question"
"intention"
"answer"

Skills gap:

"skill"
"severity"
"reason"
"recommendation"

Preparation plan:

"day"
"focus"
"tasks"

DO NOT use:

"questions"
"intentions"
"answers"

The following is WRONG:

{
    "questions": "...",
    "intentions": "...",
    "answers": "..."
}

The following is CORRECT:

{
    "question": "...",
    "intention": "...",
    "answer": "..."
}


==================================================
ARRAY REQUIREMENTS
==================================================

technicalQuestions MUST be an array of objects.

behavioralQuestions MUST be an array of objects.

skillsGap MUST be an array of objects.

preparationPlan MUST be an array of objects.

Do NOT return arrays containing property names.

For example, this is WRONG:

"technicalQuestions": [
    "questions",
    "intentions",
    "answers"
]

This is CORRECT:

"technicalQuestions": [
    {
        "question": "What is...",
        "intention": "This evaluates...",
        "answer": "A strong answer is..."
    }
]


==================================================
ROOT PROPERTY ORDER
==================================================

The first root property should be:

"matchScore"

Then:

"technicalQuestions"
"behavioralQuestions"
"skillsGap"
"preparationPlan"

Return ONLY the JSON object.
`;


        // ==================================================
        // GEMINI REQUEST
        // ==================================================

        /**
         * Sends the interview analysis prompt to Gemini.
         *
         * `responseMimeType` requests JSON output.
         * `responseJsonSchema` provides the expected structure.
         * A low temperature is used to encourage consistent
         * and predictable output.
         */
        const response = await ai.models.generateContent({

            model: "gemini-3.5-flash",

            contents: prompt,

            config: {

                responseMimeType:
                    "application/json",

                responseJsonSchema:
                    responseSchema,

                temperature: 0.2,

            },

        });


        // ==================================================
        // GET GEMINI RESPONSE
        // ==================================================

        /**
         * Extract the generated text from Gemini's response.
         */
        const rawText = response.text;


        /**
         * Prevent processing an empty Gemini response.
         */
        if (!rawText) {

            throw new Error(
                "Gemini returned an empty response."
            );

        }


        /**
         * Log the raw Gemini response for debugging.
         */
        console.log(
            "\n========== RAW GEMINI RESPONSE ==========\n"
        );

        console.log(rawText);


        // ==================================================
        // PARSE JSON
        // ==================================================

        /**
         * Convert Gemini's JSON string into a JavaScript object.
         */
        let parsedResponse;

        try {

            parsedResponse =
                JSON.parse(rawText);

        } catch (error) {

            console.error(
                "Gemini returned invalid JSON:"
            );

            console.error(rawText);

            throw new Error(
                "Gemini returned invalid JSON."
            );

        }


        // ==================================================
        // ZOD VALIDATION
        // ==================================================

        /**
         * Validate the parsed Gemini response against
         * the Zod interview report schema.
         *
         * This provides an additional layer of protection
         * before the generated data reaches the database.
         */
        const report =
            interviewReportSchema.parse(
                parsedResponse
            );


        // ==================================================
        // FINAL REPORT
        // ==================================================

        /**
         * Log the validated report for development/debugging.
         */
        console.log(
            "\n========== INTERVIEW REPORT ==========\n"
        );

        console.dir(
            report,
            {
                depth: null,
            }
        );


        // ==================================================
        // RETURN REPORT
        // ==================================================

        /**
         * Return the validated interview report to the
         * controller.
         */
        return report;


    } catch (error) {

        /**
         * Handle and log errors that occur during:
         *
         * - Input validation
         * - Gemini API request
         * - JSON parsing
         * - Zod validation
         */
        console.error(
            "\nGemini AI Error:"
        );

        console.error(error);

        /**
         * Re-throw the original error so that the controller
         * can handle it and send an appropriate HTTP response.
         */
        throw error;

    }

};


// ======================================================
// EXPORT
// ======================================================

/**
 * Export the interview report generator.
 *
 * This service can be imported into the interview controller
 * and called with:
 *
 * generateInterviewReport({
 *     resume,
 *     selfDescription,
 *     jobDescription
 * });
 */
export default generateInterviewReport;