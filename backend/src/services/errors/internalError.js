import ServiceError from "./serviceError.js";

/**
 * Base class for internal errors (database errors, etc.)
 */
export default class InternalError extends ServiceError {}