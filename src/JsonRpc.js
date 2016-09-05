/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var JSONLess = require('json-less');
var __version = '1.1.0';
var __id = 0;
var __callbacks = {};
var __callbacksTimeout = 60000;
var __options = {autoFireCallbacks : true};
/**
 * @abstract
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
class JsonRpc {
	/**
	 * @param {Object} message
	 */
	constructor(message) {
		if (this.constructor === JsonRpc) {
			throw new TypeError('Abstract class "JsonRpc" cannot be instantiated directly.');
		}
		if (message.callback !== undefined) {
			var callback = message.callback;
			delete message.callback;
		}
		this.message = message;
		if (callback) {
			this.setCallback(callback);
		}
		if (this.constructor === Response) {
			if (__options.autoFireCallbacks) {
				if (__callbacks[this.getId()] !== undefined) {
					JsonRpc.fireCallback(this);
				}
			}
		}
	}

	/**
	 * Sets global options
	 * @param {Object} options
	 */
	static setOptions(options) {
		utls.extend(__options, options);
	}

	/**
	 * Gets global options
	 * @returns {Object}
	 */
	static getOptions() {
		return __options;
	}

	/**
	 * Gets message type
	 * @param {Object} message
	 * @returns {string} Posible values: request, response, notification
	 * @throws {Error}
	 */
	static getType(message) {
		if (!(message instanceof Object)) {
			throw new Error('(JsonRpc) -> getType(): Message parameter must be object');
		}
		switch (true) {
			case JsonRpc.isValidRequest(message):
				return 'request';
			case JsonRpc.isValidResponse(message):
				return 'response';
			case JsonRpc.isValidNotification(message):
				return 'notification';
			default:
				break;
		}
	}

	/**
	 * Parse message
	 * @param {Object|String} message
	 * @returns {JsonRpcRequest|JsonRpcResponse|JsonRpcNotification}
	 * @throws {Error}
	 */
	static parse(message) {
		if (utls.getType(message) !== 'Object') {
			if (utls.getType(message) === 'String') {
				try {
					message = JSONLess.parse(message);
				} catch (e) {
					throw new Error('(JsonRpc) -> parse(): ' + JsonRpcError.E_PARSE.message, JsonRpcError.E_PARSE.code);
				}
			} else {
				throw new Error('(JsonRpc) -> parse(): Message must be string or object type');
			}
		}
		switch (JsonRpc.getType(message)) {
			case 'request':
				return new Request(message);
			case 'response':
				return new Response(message);
			case 'notification':
				return new Notification(message);
			default:
				throw new Error('(JsonRpc) -> parse(): Unknown message type');
		}
	}

	/**
	 * Checks that message is valid request
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static isValidRequest(message) {
		if (utls.getType(message) !== 'Object') {
			return false;
		}
		if (message.error !== undefined || message.result !== undefined) {
			return false;
		}
		return message.version === __version && utls.getType(message.id) === 'Integer' && message.id > 0 && utls.getType(message.resource) === 'String' && !!message.resource.length && utls.getType(message.method) === 'String' && !!message.method.length && utls.getType(message.params) === 'Object';
	}

	/**
	 * Checks that message is valid response
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static isValidResponse(message) {
		if (utls.getType(message) !== 'Object') {
			return false;
		}
		if (message.method !== undefined || message.resource !== undefined || message.params !== undefined) {
			return false;
		}
		if (message.id !== undefined) {
			if (utls.getType(message.id) !== 'Integer' || message.id <= 0) {
				return false;
			}
		}
		return message.version === __version && (message.result !== undefined || ((utls.getType(message.error) === 'Object' && utls.equals(Object.getOwnPropertyNames(message.error).sort(), [
				'code',
				'message'
			]) && utls.getType(message.error.code) === 'Integer' && utls.getType(message.error.message) === 'String') || (utls.getType(message.error) === 'JsonRpcError' && JsonRpcError.isValid(message.error))));
	}

	/**
	 * Checks that message is valid notification
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static isValidNotification(message) {
		if (utls.getType(message) !== 'Object') {
			return false;
		}
		if (message.error !== undefined || message.result !== undefined || message.id !== undefined) {
			return false;
		}
		return message.version === __version && utls.getType(message.resource) === 'String' && message.resource.length && utls.getType(message.method) === 'String' && message.method.length && utls.getType(message.params) === 'Object';
	}

	/**
	 * Checks that message has correct syntax
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static hasValidSyntax(message) {
		return JsonRpc.isValidRequest(message) || JsonRpc.isValidResponse(message) || JsonRpc.isValidNotification(message);
	}

	/**
	 * Returns id for new request
	 * @returns {number}
	 */
	static getNextId() {
		return ++__id;
	}

	/**
	 * Fires callback for response if any, if callback not found do nothing
	 * @param {JsonRpcResponse} response
	 */
	static fireCallback(response) {
		if (response instanceof Response) {
			var callback = __callbacks[response.getId()];
			if (callback instanceof Object && callback.cb instanceof Function) {
				callback.cb(response);
				JsonRpc.removeCallback(response.getId());
			}
		} else {
			throw new Error('(JsonRpc) -> fireCallback(): Response must be instance of JsonRpcResponse');
		}
	}

	/**
	 * Removes registerd callback if exists
	 * @param {Number} id
	 */
	static removeCallback(id) {
		var callback = __callbacks[id];
		if (callback instanceof Object) {
			clearTimeout(callback.timeout);
			delete __callbacks[id];
		}
	}

	/**
	 * Determinates is current message is request
	 * @returns {Boolean}
	 */
	get isRequest() {
		return this instanceof Request;
	}

	/**
	 * Determinates is current message is response
	 * @returns {Boolean}
	 */
	get isResponse() {
		return this instanceof Response;
	}

	/**
	 * Determinates is current message is notification
	 * @returns {Boolean}
	 */
	get isNotification() {
		return this instanceof Notification;
	}

	/**
	 * Gets messeage schema version
	 * @returns {String}
	 */
	getVersion() {
		return this.message.version;
	}

	/**
	 * Sets messeage schema version
	 * @param {String} version
	 * @deprecated Will be removed in 1.3.x
	 */
	setVersion(version) {
		this.message.version = version;
		return this;
	}

	/**
	 * Gets messeage id
	 * @returns {Number}
	 */
	getId() {
		return this.message.id;
	}

	/**
	 * Sets messeage id
	 * @param {Number} id
	 * @returns {JsonRpc}
	 */
	setId(id) {
		if (utls.getType(id) !== 'Integer') {
			throw new Error('(JsonRpc) -> setId(): Id must be integer');
		}
		this.message.id = id;
		return this;
	}

	/**
	 * Gets messeage resource for method
	 * @returns {String}
	 */
	getResource() {
		return this.message.resource;
	}

	/**
	 * Sets messeage resource for method
	 * @param {String} resource
	 * @returns {JsonRpc}
	 */
	setResource(resource) {
		if (utls.getType(resource) !== 'String') {
			throw new Error('(JsonRpc) -> setResource(): Resource must be "String" type');
		}
		this.message.resource = resource;
		return this;
	}

	/**
	 * Gets messeage method
	 * @returns {String}
	 */
	getMethod() {
		return this.message.method;
	}

	/**
	 * Sets messeage method
	 * @param {String} method
	 * @returns {JsonRpc}
	 */
	setMethod(method) {
		if (utls.getType(method) !== 'String') {
			throw new Error('(JsonRpc) -> setMethod(): Method must be "String" type');
		}
		this.message.method = method;
		return this;
	}

	/**
	 * Gets messeage callback
	 * @returns {Function|undefined}
	 */
	getCallback() {
		return typeof __callbacks[this.message.id] === 'object' ? __callbacks[this.message.id].cb : undefined;
	}

	/**
	 * Sets messeage callback
	 * @param {Function} callback Callback to be fired when got response
	 * @param {Number} tls Time in ms how long keep uncalled callback
	 * @returns {JsonRpc}
	 */
	setCallback(callback, tls) {
		tls = tls || __callbacksTimeout;
		if (typeof callback !== 'function') {
			throw new Error('(JsonRpc) -> setCallback(): Callback must be function');
		}
		var self = this;
		var timeout = setTimeout(() => {
			JsonRpc.removeCallback(self.message.id);
		}, tls);
		__callbacks[this.message.id] = {
			cb : callback,
			timeout : timeout
		};
		return this;
	}

	/**
	 * Gets messeage parameters for method
	 * @returns {Object}
	 */
	getParams() {
		return this.message.params;
	}

	/**
	 * Sets messeage parameters for method
	 * @param {Object} params
	 * @returns {JsonRpc}
	 */
	setParams(params) {
		if (utls.getType(params) !== 'Object') {
			throw new Error('(JsonRpc) -> setParams(): Params must be "Object" type');
		}
		this.message.params = params;
		return this;
	}

	/**
	 * Gets messeage result
	 * @returns {*}
	 */
	getResult() {
		return this.message.result;
	}

	/**
	 * Sets messeage result
	 * @param {*} result
	 * @returns {JsonRpc}
	 */
	setResult(result) {
		this.message.result = result;
		return this;
	}

	/**
	 * Gets messeage Error
	 * @returns {JsonRpcError}
	 */
	getError() {
		return this.message.error;
	}

	/**
	 * Sets messeage
	 * @param {JsonRpcError|Object} error
	 * @returns {JsonRpc}
	 */
	setError(error) {
		if (!(error instanceof JsonRpcError)) {
			error = new JsonRpcError(error);
		}
		this.message.error = error;
		return this;
	}

	/**
	 *
	 * @returns {{version: *, id: *, resource: *, method: *, params: *, callback: *}}
	 */
	toJSON() {
		return this.message;
	}

	/**
	 *
	 * @returns {String}
	 */
	toString() {
		return JSONLess.stringify(this.toJSON());
	}
}
module.exports = JsonRpc;
var Request = require('./JsonRpcRequest.js');
var Response = require('./JsonRpcResponse.js');
var Notification = require('./JsonRpcNotification.js');
var JsonRpcError = require('./JsonRpcError.js');
module.exports.Request = Request;
module.exports.Response = Response;
module.exports.Notification = Notification;
module.exports.JsonRpcError = JsonRpcError;
module.exports.version = __version;
module.exports.addHandler = JSONLess.addHandler;
