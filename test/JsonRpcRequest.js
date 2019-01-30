/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
/* global describe, it*/
"use strict";
const {uc_first} = require("../src/common");
const JR = require(__dirname + "/../index.js");
const jr = new JR;
const assert = require("assert");
describe("JsonRpcRequest", () => {
	it("invalid message type", () => {
		assert.throws(() => {
			jr.Request("");
		});
	});
	//MARK
	it.skip("not valid syntax", () => {
		assert.throws(() => {
			jr.Request({});
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
				callback: (res) => {
					assert.ok(res instanceof JR.Response);
					assert.strictEqual(res.getId(), 1);
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
					result: ""
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
			req.setCallback((res) => {
				assert.ok(res instanceof JR.Response);
				assert.strictEqual(res.getId(), 2);
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
					result: ""
				}).toString());
			});
		});
	});
});
