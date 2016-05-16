/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var JsonRpc = require('./JsonRpc.js');
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 * @extends JsonRpc
 */
class JsonRpcResponse extends JsonRpc {
	/**
	 * @param {Object} message
	 */
	constructor(message) {
		if (message !== undefined) {
			if (utls.getType(message) !== 'Object') {
				throw new Error('(JsonRpcResponse) -> constructor(): Message must be object type');
			}
			message.version = message.version || JsonRpc.version;
			if (!JsonRpc.isValidResponse(message)) {
				throw new Error('(JsonRpcResponse) -> constructor(): Message is not valid json rpc response');
			}
		} else {
			message = {};
			message.version = JsonRpc.version;
		}
		super(message);
	}

	/**
	 * @private
	 * @param version
	 */
	setVersion(version) {
		throw new Error('(JsonRpcResponse) -> setVersion(): Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @returns {*}
	 */
	getResource() {
		throw new Error('(JsonRpcResponse) -> getResource(): Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @param resource
	 * @returns {JsonRpc}
	 */
	setResource(resource) {
		throw new Error('(JsonRpcResponse) -> setResource(): Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @returns {*}
	 */
	getMethod() {
		throw new Error('(JsonRpcResponse) -> getMethod(): Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @param method
	 * @returns {JsonRpc}
	 */
	setMethod(method) {
		throw new Error('(JsonRpcResponse) -> setMethod(): Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @returns {*}
	 */
	getCallback() {
		throw new Error('(JsonRpcResponse) -> getCallback(): Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @param {Function} callback
	 * @param {Number} tls
	 * @returns {JsonRpc}
	 */
	setCallback(callback, tls) {
		throw new Error('(JsonRpcResponse) -> setCallback(): Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @returns {*}
	 */
	getParams() {
		throw new Error('(JsonRpcResponse) -> getParams(): Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @param params
	 * @returns {JsonRpc}
	 */
	setParams(params) {
		throw new Error('(JsonRpcResponse) -> setParams(): Method not available in module "JsonRpcResponse"');
	}
}
module.exports = JsonRpcResponse;
