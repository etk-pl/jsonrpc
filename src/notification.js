/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
const {getVersion, getResource, getMethod, getParams, setVersion, setResource, setMethod, setParams, toJSON, toString} = require("./traits");
const {uc_first} = require("./common");
const JsonRpc = require("./jsonrpc.js");
const ExtError = require("exterror");

/**
 * @param {JsonRpc} jr
 * @param {Object} message
 * @constructor
 */
function Notification(jr, message) {
	this.jr = jr;
	this.message = {
		version: JsonRpc.version,
		resource: "__global__",
		method: "",
		params: {}
	};
	if (message !== undefined) {
		if (typeof message !== "object" || message === null) {
			throw new ExtError("", "(JsonRpcNotification) -> constructor(): Message must be object type");
		}
		Object.entries(message).forEach(([key, value]) => {
			this["set" + uc_first(key)](value);
		});
	}
}

/**
 * Use traits
 */
Object.assign(Notification.prototype, {
	getVersion,
	getResource,
	getMethod,
	getParams,
	setVersion,
	setResource,
	setMethod,
	setParams,
	toJSON,
	toString
});
module.exports = Notification;
