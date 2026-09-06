import mongoose from "mongoose";

/**
 * Token Blacklist Schema
 *
 * Defines the structure of JWT tokens that have been
 * invalidated, usually after a user logs out.
 *
 * @property {string} token - The JWT token that has been blacklisted.
 * @property {Date} createdAt - The date and time when the token was blacklisted.
 * @property {Date} updatedAt - The date and time when the blacklist record was updated.
 */
const TokenBlackList = new mongoose.Schema(
  {
    /**
     * Blacklisted JWT authentication token.
     *
     * @type {String}
     * @required
     */
    token: {
      type: String,
      required: [true, "Token Is Required"],
    },
  },
  {
    /**
     * Automatically adds `createdAt` and `updatedAt`
     * fields to each blacklist document.
     */
    timestamps: true,
  },
);

/**
 * Token Blacklist Mongoose Model.
 *
 * Used to store JWT tokens that should no longer
 * be accepted by the authentication system.
 *
 * @type {mongoose.Model}
 */
const tokenBlackList = mongoose.model("TokenBlacklist", TokenBlackList);

export default tokenBlackList;
