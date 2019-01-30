/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
const __version = "1.3.0";
const JSONLess = require("json-less");
const ExtError = require("exterror");
const error_codes = require("./codes");

/**
 *
 * @param {Object} [options]
 * @param {boolean} [options.autoFireCallbacks]
 * @param {number} [options.callbacksTimeout]
 * @param {Object} [options.encoder]
 * @param {Function} options.encoder.parse
 * @param {Function} options.encoder.stringify
 * @constructor
 */
function JsonRpc(options) {
	this.__id = 0;
	this.options = Object.assign({
		autoFireCallbacks: true,
		callbacksTimeout: 60000,
		encoder: JSONLess
	}, options || {});
	this.callbacks = {};
}

/**
 *
 * @returns {{autoFireCallbacks: boolean, encoder, callbacksTimeout: number}}
 */
JsonRpc.prototype.getOptions = function () {
	return this.options;
};
/**
 *
 * @param {Object} options
 */
JsonRpc.prototype.setOptions = function (options) {
	Object.assign(this.options, options);
};
/**
 * Gets message type
 * @param {Object} message
 * @returns {string} Possible values: request, response, notification
 * @throws {Error}
 */
JsonRpc.getType = function (message) {
	if (typeof message !== "object" || message === null) {
		throw new ExtError("ERR_MESSAGE_PARAM_MUST_BE_OBJECT", "Message parameter must be object");
	}
	switch (true) {
		case JsonRpc.isValidRequest(message):
			return "Request";
		case JsonRpc.isValidResponse(message):
			return "Response";
		case JsonRpc.isValidNotification(message):
			return "Notification";
		default:
			break;
	}
};
/**
 * Parse message
 * @param {Object|String} message
 * @returns {Request|Response|Notification}
 * @throws {Error|TypeError}
 */
JsonRpc.prototype.parse = function (message) {
	if (typeof message !== "object") {
		if (typeof message === "string") {
			try {
				message = this.options.encoder.parse(message);
			} catch (e) {
				const {code, message} = error_codes.E_PARSE;
				throw new ExtError(code, message);
			}
		} else {
			throw new TypeError("(JsonRpc) -> parse(): Message must be string or object type");
		}
	}
	const type = JsonRpc.getType(message);
	switch (type) {
		case "Request":
			return this.Request(message);
		case "Response":
			const response = this.Response(message);
			this.fireCallback(response);
			return response;
		case "Notification":
			return this.Notification(message);
		default:
			throw new ExtError("ERR_TYPE", "Type " + type);
	}
};
/**
 *
 * @returns {number}
 */
JsonRpc.prototype.getNextId = function () {
	return ++this.__id;
};
/**
 * Checks that message is valid request
 * @param {Object} message
 * @returns {Boolean}
 */
JsonRpc.isValidRequest = function isValidRequest(message) {
	if (typeof message !== "object" || message === null) {
		return false;
	}
	if (message.error !== undefined || message.result !== undefined) {
		return false;
	}
	return message.version === __version && typeof message.id === "number" && message.id > 0 && typeof message.resource === "string" && !!message.resource.length && typeof message.method === "string" && !!message.method.length && typeof message.params === "object" && message.params !== null;
};
/**
 * Checks that message is valid response
 * @param {Object} message
 * @returns {Boolean}
 */
JsonRpc.isValidResponse = function isValidResponse(message) {
	if (typeof message !== "object" || message === null) {
		return false;
	}
	if (message.method !== undefined || message.resource !== undefined || message.params !== undefined) {
		return false;
	}
	if (message.id !== undefined) {
		if (typeof message.id !== "number" || message.id <= 0) {
			return false;
		}
	}
	return message.version === __version && (message.result !== undefined || ((typeof message.error === "object" && message.error !== null && Object.getOwnPropertyNames(message.error).sort().join(" ") === [
		"code",
		"message"
	].join(" ") && typeof message.error.code === "string" && typeof message.error.message === "string") || message.error instanceof ExtError));
};
/**
 * Checks that message is valid notification
 * @param {Object} message
 * @returns {Boolean}
 */
JsonRpc.isValidNotification = function isValidNotification(message) {
	if (typeof message !== "object" || message === null) {
		return false;
	}
	if (message.error !== undefined || message.result !== undefined || message.id !== undefined) {
		return false;
	}
	return !!(message.version === __version && typeof message.resource === "string" && message.resource.length && typeof message.method === "string" && message.method.length && (typeof message.params === "object" && message.params !== null));
};
/**
 * Checks that message has correct syntax
 * @param {Object} message
 * @returns {Boolean}
 */
JsonRpc.hasValidSyntax = function (message) {
	return JsonRpc.isValidRequest(message) || JsonRpc.isValidResponse(message) || JsonRpc.isValidNotification(message);
};
/**
 * Returns id for new request
 * @returns {number}
 */
JsonRpc.prototype.getNextId = function () {
	return ++this.__id;
};
/**
 * Fires callback for response if any, if callback not found do nothing
 * @param {Response} response
 */
JsonRpc.prototype.fireCallback = function (response) {
	if (response instanceof Response) {
		const callback = this.callbacks[response.getId()];
		if (callback instanceof Object && callback.cb instanceof Function) {
			clearTimeout(callback.timeout);
			callback.cb(response);
			this.removeCallback(response.getId());
		}
	} else {
		throw new Error("(JsonRpc) -> fireCallback(): Response must be instance of Response");
	}
};
/**
 * Removes registered callback if exists
 * @param {Number} id
 */
JsonRpc.prototype.removeCallback = function (id) {
	const callback = this.callbacks[id];
	if (typeof callback === "object" && callback !== null) {
		delete this.callbacks[id];
	}
};
module.exports = JsonRpc;
const Request = require("./request.js");
const Response = require("./response.js");
const Notification = require("./notification.js");
module.exports.Request = Request;
module.exports.Response = Response;
module.exports.Notification = Notification;
module.exports.version = __version;
module.exports.addHandler = JSONLess.addHandler;
JSONLess.addHandler(ExtError, (cls, value) => {
	return value.toJSON();
}, (cls, value) => {
	return new ExtError(value.code, value.message);
});
/**
 *
 * @param message
 * @returns {Request}
 * @constructor
 */
JsonRpc.prototype.Request = function (message) {
	return new Request(this, message);
};
/**
 *
 * @param message
 * @returns {Response}
 * @constructor
 */
JsonRpc.prototype.Response = function (message) {
	return new Response(this, message);
};
/**
 *
 * @param message
 * @returns {Notification}
 * @constructor
 */
JsonRpc.prototype.Notification = function (message) {
	return new Notification(this, message);
};
