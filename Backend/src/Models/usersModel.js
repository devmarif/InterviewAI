import mongoose from "mongoose";

/**
 * User Schema
 *
 * Defines the structure of a user document stored in MongoDB.
 *
 * @property {string} userName - Unique username of the user.
 * @property {string} email - Unique email address of the user.
 * @property {string} password - Hashed password of the user.
 */
const userSchema = new mongoose.Schema({
  /**
   * Username of the user.
   *
   * @type {String}
   * @required
   * @unique
   */
  userName: {
    type: String,
    required: true,
    unique: true,
  },

  /**
   * Email address of the user.
   *
   * @type {String}
   * @required
   * @unique
   */
  email: {
    type: String,
    required: true,
    unique: true,
  },

  /**
   * Hashed password of the user.
   *
   * @type {String}
   * @required
   */
  password: {
    type: String,
    required: true,
  },
});

/**
 * Mongoose User Model.
 *
 * Used to create, read, update and delete
 * user documents in the MongoDB database.
 *
 * @type {mongoose.Model}
 */
const userModel = mongoose.model("users", userSchema);

export default userModel;
