/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
const utls = require('utls');
const JsonRpc = require('./JsonRpc.js');
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 * @extends JsonRpc
 */
class JsonRpcNotification extends JsonRpc {
	/**
	 * @param {Object} message
	 */
	constructor(message) {
		if (message !== undefined) {
			if (typeof message !== 'object' || message === null) {
				throw new Error('(JsonRpcNotification) -> constructor(): Message must be object type');
			}
			message.version = message.version || JsonRpc.version;
			message.resource = message.resource || '__global__';
			message.params = message.params || {};
			if (!JsonRpc.isValidNotification(message)) {
				throw new Error('(JsonRpcNotification) -> constructor(): Message is not valid json rpc notification');
			}
		} else {
			message = {};
			message.version = JsonRpc.version;
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
		throw new Error('(JsonRpcNotification) -> setVersion(): Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 */
	getId() {
		throw new Error('(JsonRpcNotification) -> getId(): Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 * @param id
	 */
	setId(id) {
		throw new Error('(JsonRpcNotification) -> setId(): Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 */
	getError() {
		throw new Error('(JsonRpcNotification) -> getError(): Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 * @param error
	 */
	setError(error) {
		throw new Error('(JsonRpcNotification) -> setError(): Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 */
	getResult() {
		throw new Error('(JsonRpcNotification) -> getResult(): Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 * @param result
	 */
	setResult(result) {
		throw new Error('(JsonRpcNotification) -> setResult(): Method not available in module "JsonRpcNotification"');
	}
}
module.exports = JsonRpcNotification;