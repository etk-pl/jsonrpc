/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
/**
 * Global response counter
 * @type {number}
 * @private
 */
const {getVersion, getId, getResult, getError, setVersion, setId, setResult, setError, toJSON, toString} = require("./traits");
const {uc_first} = require("./common");
const JsonRpc = require("./jsonrpc.js");
const ExtError = require("exterror");

/**
 * @param {JsonRpc} jr
 * @param {Object} message
 * @constructor
 */
function Response(jr, message) {
	this.jr = jr;
	this.message = {
		version: JsonRpc.version
	};
	if (message !== undefined) {
		if (typeof message !== "object" || message === null) {
			throw new ExtError("ERR_RESPONSE_MESSAGE_INCORRECT_TYPE", "Message must be object type");
		}
		Object.entries(message).forEach(([key, value]) => {
			this["set" + uc_first(key)](value);
		});
	}
}

Object.assign(Response.prototype, {
	getVersion,
	getId,
	getResult,
	getError,
	setVersion,
	setId,
	setResult,
	setError,
	toJSON,
	toString
});
module.exports = Response;
