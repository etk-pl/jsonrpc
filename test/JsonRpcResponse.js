/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var jsonrpc = require(__dirname + '/../index.js');
var assert = require('assert');
describe('JsonRpcResponse', () => {
	it('invalid message type', () => {
		assert.throws(() => {
			new jsonrpc.Response('');
		});
	});
	it('not valid syntax', () => {
		assert.throws(() => {
			new jsonrpc.Response({});
		});
	});
	it('is', () => {
		assert.equal((new jsonrpc.Response()).isNotification, false);
		assert.equal((new jsonrpc.Response()).isRequest, false);
		assert.equal((new jsonrpc.Response()).isResponse, true);
	});
	it('defaults', () => {
		var res = new jsonrpc.Response();
		assert.equal(res.getVersion(), jsonrpc.version);
	});
	describe('restricted methods', () => {
		var obj = new jsonrpc.Response();
		var methods = 'resource,method,params,callback'.split(',');
		it('setVersion', ()=> {
			assert.throws(() => {
				obj.setVersion("0.0.0");
			});
		});
		methods.forEach((method, key) => {
			it('get' + utls.ucFirst(method), ()=> {
				assert.throws(() => {
					obj['get' + utls.ucFirst(method)]();
				});
			});
			it('set' + utls.ucFirst(method), ()=> {
				assert.throws(() => {
					obj['set' + utls.ucFirst(method)]();
				});
			});
		});
	});
	describe('manual creation', () => {
		it('constructor params with result', () => {
			assert.deepEqual((new jsonrpc.Response({
				id : 1,
				result : {some : 'result'}
			})).toJSON(), {
				id : 1,
				version : jsonrpc.version,
				result : {some : 'result'}
			});
		});
		it('methods with result', () => {
			var not = new jsonrpc.Response();
			not.setId(1);
			not.setResult({some : 'result'});
			assert.equal(not.getVersion(), jsonrpc.version);
			assert.equal(not.getId(), 1);
			assert.deepStrictEqual(not.getResult(), {some : 'result'});
			assert.equal(not.getError(), undefined);
		});
		it('constructor params with error', () => {
			assert.deepEqual((new jsonrpc.Response({
				id : 1,
				error : new jsonrpc.JsonRpcError({
					message : "some error",
					code : "0"
				})
			})).toJSON(), {
				id : 1,
				version : jsonrpc.version,
				error : new jsonrpc.JsonRpcError({
					message : "some error",
					code : "0"
				})
			});
		});
		it('methods with error', () => {
			var not = new jsonrpc.Response();
			var error = new jsonrpc.JsonRpcError();
			error.setMessage("some message").setCode("0");
			not.setId(1);
			not.setError(error);
			assert.deepEqual(not.toJSON(), {
				id : 1,
				version : jsonrpc.version,
				error : {
					message : error.getMessage(),
					code : error.getCode()
				}
			});
		});
	});
});