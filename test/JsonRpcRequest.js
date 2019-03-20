/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
/* global describe, it*/
"use strict";
const {uc_first} = require("../src/common");
const JR = require(__dirname + "/../index.js");
const jr = new JR;
const assert = require("assert");
const ExtError = require("exterror");
describe("JsonRpcRequest", () => {
	it("invalid message type", () => {
		assert.throws(() => {
			jr.Request("");
		});
	});
	it("defaults", () => {
		const req = jr.Request();
		assert.strictEqual(req.getVersion(), JR.version);
		assert.strictEqual(req.getResource(), "__global__");
		assert.deepStrictEqual(req.getParams(), {});
		assert.strictEqual(typeof req.getId(), "number");
	});
	describe("restricted methods", () => {
		const obj = jr.Request();
		const methods = "result,error".split(",");
		it("setVersion", () => {
			assert.throws(() => {
				obj.setVersion("0.0.0");
			});
		});
		methods.forEach((method) => {
			it("get" + uc_first(method), () => {
				assert.throws(() => {
					obj["get" + uc_first(method)]();
				});
			});
			it("set" + uc_first(method), () => {
				assert.throws(() => {
					obj["set" + uc_first(method)]();
				});
			});
		});
	});
	describe("manual creation", () => {
		it("constructor params", (done) => {
			assert.deepStrictEqual((jr.Request({
				id: 1,
				resource: "someNS",
				method: "someMethod",
				params: {some: "params"},
				callback: (err, res) => {
					assert.strictEqual(err, undefined);
					assert.strictEqual(res, "some result");
					done();
				}
			})).toJSON(), {
				id: 1,
				version: JR.version,
				resource: "someNS",
				method: "someMethod",
				params: {"some": "params"}
			});
			setImmediate(() => {
				jr.parse(jr.Response({
					id: 1,
					result: "some result"
				}).toString());
			});
		});
		it("promise", (done) => {
			const req = jr.Request({
				id: 1,
				resource: "someNS",
				method: "someMethod",
				params: {some: "params"}
			});
			req.promise().then((res) => {
				assert.strictEqual(res, "some result");
				done();
			}).catch(done);
			assert.deepStrictEqual(req.toJSON(), {
				id: 1,
				version: JR.version,
				resource: "someNS",
				method: "someMethod",
				params: {"some": "params"}
			});
			setImmediate(() => {
				jr.parse(jr.Response({
					id: 1,
					result: "some result"
				}).toString());
			});
		});
		it("methods", (done) => {
			const req = jr.Request();
			req.setId(2);
			assert.throws(() => {
				req.setId("1");
			});
			req.setResource("someResource");
			assert.throws(() => {
				req.setResource(null);
			});
			req.setMethod("someMethod");
			assert.throws(() => {
				req.setMethod(null);
			});
			req.setParams({some: "params"});
			assert.throws(() => {
				req.setParams(null);
			});
			req.setCallback((err, res) => {
				assert.strictEqual(err, undefined);
				assert.strictEqual(res, "result");
				done();
			});
			assert.throws(() => {
				req.setCallback("cb", "tls");
			});
			assert.strictEqual(req.getResource(), "someResource");
			assert.strictEqual(req.getMethod(), "someMethod");
			assert.deepStrictEqual(req.getParams(), {some: "params"});
			assert.strictEqual(req.getId(), 2);
			setImmediate(() => {
				jr.parse(jr.Response({
					id: 2,
					result: "result"
				}).toString());
			});
		});
		describe("Timeout", () => {
			it("callback", (done) => {
				const req = jr.Request();
				req.setCallback((err, res) => {
					assert(err instanceof ExtError);
					assert.strictEqual(err.code, "ERR_RPC_REQUEST_TIMEOUT");
					assert(!res);
					done();
				}, 1);
			});
			it("promise", (done) => {
				const req = jr.Request();
				req.promise(1).then((res) => {
					assert(!res);
					done();
				}).catch((err) => {
					assert(err instanceof ExtError);
					assert.strictEqual(err.code, "ERR_RPC_REQUEST_TIMEOUT");
					done();
				});
			});
		});
	});
});
