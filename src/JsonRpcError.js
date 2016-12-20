/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
const utls = require('utls');
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
class JsonRpcError {
	/**
	 *
	 * @param message
	 * @param code
	 */
	constructor(message, code) {
		this.code = 0;
		this.message = '';
		if (typeof  message === 'object') {
			code = message.code;
			message = message.message;
		}
		if (typeof message === 'string') {
			this.setMessage(message);
		}
		if (typeof code === 'number') {
			this.setCode(code);
		}
	}

	/**
	 *
	 * @returns {Number}
	 */
	getCode() {
		return this.code;
	}

	/**
	 *
	 * @returns {String}
	 */
	getMessage() {
		return this.message;
	}

	/**
	 *
	 * @param code
	 * @returns {JsonRpcError}
	 */
	setCode(code) {
		if (utls.getType(code) !== 'Integer') {
			throw new Error('(JsonRpcError) -> setCode(): Code must be number');
		}
		this.code = code;
		return this;
	}

	/**
	 *
	 * @param message
	 * @returns {JsonRpcError}
	 */
	setMessage(message) {
		if (typeof message !== 'string' && !message.length) {
			throw new Error('(JsonRpcError) -> setMessage(): Message must be non-zero length string');
		}
		this.message = message;
		return this;
	}

	/**
	 *
	 * @param error
	 * @returns {Boolean}
	 */
	static isValid(error) {
		return error instanceof JsonRpcError || (typeof error === 'object' && error !== null && utls.equals(Object.getOwnPropertyNames(error).sort(), [
				'code',
				'message'
			]) && utls.getType(error.code) === 'Integer' && utls.getType(error.message) === 'String' && !!error.message.length);
	}
}
/**
 * Parse error
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_PARSE = {
	code : -1,
	message : 'Parse error'
};
/**
 * Invalid Request
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_INVALID_REQUEST = {
	code : -2,
	message : 'Invalid Request'
};
/**
 * Resource not found
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_RESOURCE_NOT_FOUND = {
	code : -3,
	message : 'Resource not found'
};
/**
 * Method not found
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_METHOD_NOT_FOUND = {
	code : -4,
	message : 'Method not found'
};
/**
 * Invalid params
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_INVALID_PARAMS = {
	code : -5,
	message : 'Invalid params'
};
/**
 * Internal error
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_INTERNAL = {
	code : -6,
	message : 'Internal error'
};
module.exports = JsonRpcError;
