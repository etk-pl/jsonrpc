/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
module.exports = {
	/**
	 * Parse error
	 * @type {{code: number, message: string}}
	 */
	E_PARSE: {
		code: "E_PARSE",
		message: "Parse error"
	},
	/**
	 * Invalid Request
	 * @type {{code: number, message: string}}
	 */
	E_INVALID_REQUEST: {
		code: "E_INVALID_REQUEST",
		message: "Invalid Request"
	},
	/**
	 * Resource not found
	 * @type {{code: number, message: string}}
	 */
	E_RESOURCE_NOT_FOUND: {
		code: "E_RESOURCE_NOT_FOUND",
		message: "Resource not found"
	},
	/**
	 * Method not found
	 * @type {{code: number, message: string}}
	 */
	E_METHOD_NOT_FOUND: {
		code: "E_METHOD_NOT_FOUND",
		message: "Method not found"
	},
	/**
	 * Invalid params
	 * @type {{code: number, message: string}}
	 */
	E_INVALID_PARAMS: {
		code: "E_INVALID_PARAMS",
		message: "Invalid params"
	},
	/**
	 * Internal error
	 * @type {{code: number, message: string}}
	 */
	E_INTERNAL: {
		code: "E_INTERNAL",
		message: "Internal error"
	}
};
