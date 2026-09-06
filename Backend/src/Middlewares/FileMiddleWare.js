import multer from "multer";

/**
 * Multer upload configuration.
 *
 * This middleware is responsible for handling file uploads
 * and storing uploaded files temporarily in memory.
 *
 * Storage:
 * - Uses memoryStorage(), so files are stored in RAM instead
 *   of being saved directly to the server's filesystem.
 *
 * File Size:
 * - Maximum allowed file size is 3 MB.
 *
 * @constant
 * @type {Multer}
 */
const uploadFile = multer({
    /**
     * Store uploaded files in memory.
     *
     * The uploaded file will be available through:
     * req.file.buffer
     */
    storage: multer.memoryStorage(),

    /**
     * Restrict uploaded files to a maximum of 3 MB.
     *
     * 3 * 1024 * 1024 = 3 MB
     */
    limits: {
        fileSize: 3 * 1024 * 1024,
    },
});

/**
 * Export the configured Multer middleware.
 */
export default uploadFile;