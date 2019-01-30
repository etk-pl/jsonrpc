/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
/**
 * Global request counter
 * @type {number}
 * @private
 */
const {getVersion, getId, getResource, getMethod, getParams, getCallback, setVersion, setId, setResource, setMethod, setParams, setCallback, toJSON, toString} = require("./traits");
const {uc_first} = require("./common");
const JsonRpc = require("./jsonrpc.js");
const ExtError = require("exterror");

/**
 * @param {JsonRpc} jr
 * @param {Object} message
 * @constructor
 */
function Request(jr, message) {
	this.jr = jr;
	this.message = {
		version: JsonRpc.version,
		id: jr.getNextId(),
		resource: "__global__",
		method: "",
		params: {}
	};
	if (message !== undefined) {
		if (typeof message !== "object" || message === null) {
			throw new ExtError("ERR_REQUEST_MESSAGE_INCORRECT_TYPE", "Message must be object type");
		}
		Object.entries(message).forEach(([key, value]) => {
			this["set" + uc_first(key)](value);
		});
	}
}

/**
 * @param {Number} [ttl]
 * @returns {Promise<any>}
 */
Request.prototype.promise = function (ttl) {
	return new Promise((resolve, reject) => {
		this.setCallback((response) => {
			const error = response.getError();
			if (error) {
				return reject(error);
			}
			resolve(response.getResult());
		}, ttl);
	});
};
/**
 * Use traits
 */
Object.assign(Request.prototype, {
	getVersion,
	getId,
	getResource,
	getMethod,
	getParams,
	getCallback,
	setVersion,
	setId,
	setResource,
	setMethod,
	setParams,
	setCallback,
	toJSON,
	toString
});
module.exports = Request;
