import app from "./src/app.js";
import dotenv from "dotenv";
import dns from "dns";
import ConnectDB from "./src/config/DbConnection.js";


// Configure DNS servers for MongoDB Atlas SRV resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Load environment variables from .env
dotenv.config();

/**
 * Starts the application server.
 *
 * This function:
 * - Connects to the MongoDB database.
 * - Starts the Express server after a successful database connection.
 * - Handles errors that occur during server startup.
 *
 * @async
 * @function serverStart
 * @returns {Promise<void>}
 */
const serverStart = async () => {
  try {
    // Connect to MongoDB before starting the server
    await ConnectDB();

    // Start Express server
    app.listen(3000, () => {
      console.log("Server Is Running On Port 3000");
    });
  } catch (error) {
    console.error("Error In Connecting To Server:", error.message);
  }
};

// Start application
serverStart();
