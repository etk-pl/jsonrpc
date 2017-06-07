/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
/**
 * Global request counter
 * @type {number}
 * @private
 */
const utls = require('utls');
const JsonRpc = require('./JsonRpc.js');
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 * @extends JsonRpc
 */
class JsonRpcRequest extends JsonRpc {
	/**
	 * @param {Object} message
	 */
	constructor(message) {
		if (message !== undefined) {
			if (typeof message !== 'object' || message === null) {
				throw new Error('(JsonRpcRequest) -> constructor(): Message must be object type');
			}
			message.version = message.version || JsonRpc.version;
			message.id = message.id || JsonRpc.getNextId();
			message.resource = message.resource || '__global__';
			message.params = message.params || {};
			if (!JsonRpc.isValidRequest(message)) {
				throw new Error('(JsonRpcRequest) -> constructor(): Message is not valid json rpc request');
			}
		} else {
			message = {};
			message.version = JsonRpc.version;
			message.id = JsonRpc.getNextId();
			message.resource = '__global__';
			message.params = message.params || {};
		}
		super(message);
	}

	/**
	 * @private
	 * @param version
	 */
	setVersion(version) {
		throw new Error('(JsonRpcRequest) -> setVersion(): Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 */
	getError() {
		throw new Error('(JsonRpcRequest) -> getError(): Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 * @param error
	 */
	setError(error) {
		throw new Error('(JsonRpcRequest) -> setError(): Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 */
	getResult() {
		throw new Error('(JsonRpcRequest) -> getResult(): Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 * @param result
	 */
	setResult(result) {
		throw new Error('(JsonRpcRequest) -> setResult(): Method not available in module "JsonRpcRequest"');
	}
}
module.exports = JsonRpcRequest;
