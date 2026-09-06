import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database.
 *
 * The MongoDB connection string is read from the
 * `MONGO_URI` environment variable.
 *
 * @async
 * @function ConnnectDB
 * @returns {Promise<void>} Resolves when the database connection succeeds.
 *
 * @throws {Error} Logs an error if the database connection fails.
 */
const ConnnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database Connection Error:", error.message);

    // Stop the application if the database connection fails
    process.exit(1);
  }
};

export default ConnnectDB;
