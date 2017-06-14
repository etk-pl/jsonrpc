/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var jsonrpc = require(__dirname + '/../index.js');
var assert = require('assert');
describe('JsonRpcRequest', () => {
	it('invalid message type', () => {
		assert.throws(() => {
			new jsonrpc.Request('');
		});
	});
	it('not valid syntax', () => {
		assert.throws(() => {
			new jsonrpc.Request({});
		});
	});
	it('is', () => {
		assert.equal((new jsonrpc.Request()).isNotification, false);
		assert.equal((new jsonrpc.Request()).isRequest, true);
		assert.equal((new jsonrpc.Request()).isResponse, false);
	});
	it('defaults', () => {
		var req = new jsonrpc.Request();
		assert.equal(req.getVersion(), jsonrpc.version);
		assert.equal(req.getResource(), '__global__');
		assert.deepStrictEqual(req.getParams(), {});
		assert.equal(utls.getType(req.getId()), 'Number');
	});
	describe('restricted methods', () => {
		var obj = new jsonrpc.Request();
		var methods = 'result,error'.split(',');
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
		it('constructor params', (done) => {
			assert.deepEqual((new jsonrpc.Request({
				id : 1,
				resource : "someNS",
				method : "someMethod",
				params : {some : "params"},
				callback : (res) => {
					assert.ok(res instanceof jsonrpc.Response);
					assert.equal(res.getId(), 1);
					done();
				}
			})).toJSON(), {
				id : 1,
				version : jsonrpc.version,
				resource : "someNS",
				method : "someMethod",
				params : {"some" : "params"}
			});
			setImmediate(() => {
				new jsonrpc.Response({
					id : 1,
					result : ""
				});
			});
		});
		it('methods', (done) => {
			var req = new jsonrpc.Request();
			req.setId(2);
			assert.throws(() => {
				req.setId('1');
			});
			req.setResource("someResource");
			assert.throws(() => {
				req.setResource(null);
			});
			req.setMethod("someMethod");
			assert.throws(() => {
				req.setMethod(null);
			});
			req.setParams({some : "params"});
			assert.throws(() => {
				req.setParams(null);
			});
			req.setCallback((res) => {
				assert.ok(res instanceof jsonrpc.Response);
				assert.equal(res.getId(), 2);
				done();
			});
			assert.throws(() => {
				req.setCallback('cb', 'tls');
			});
			assert.equal(req.getResource(), "someResource");
			assert.equal(req.getMethod(), "someMethod");
			assert.deepStrictEqual(req.getParams(), {some : "params"});
			assert.equal(req.getId(), 2);
			assert.equal(utls.getType(req.getCallback()), "Function");
			setImmediate(() => {
				new jsonrpc.Response({
					id : 2,
					result : ""
				});
			});
		});
	});
});
