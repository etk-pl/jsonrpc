/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
/* global describe, it*/
"use strict";
const ExtError = require("exterror");
const {uc_first} = require("../src/common");
const JR = require(__dirname + "/../index.js");
const jr = new JR;
const assert = require("assert");
describe("JsonRpcResponse", () => {
	it("invalid message type", () => {
		assert.throws(() => {
			jr.Response("");
		});
	});
	it("defaults", () => {
		const res = jr.Response();
		assert.strictEqual(res.getVersion(), JR.version);
	});
	describe("restricted methods", () => {
		const obj = jr.Response();
		const methods = "resource,method,params,callback".split(",");
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
		it("constructor params with result", () => {
			assert.deepStrictEqual((jr.Response({
				id: 1,
				result: {some: "result"}
			})).toJSON(), {
				id: 1,
				version: JR.version,
				result: {some: "result"}
			});
		});
		it("methods with result", () => {
			const not = jr.Response();
			not.setId(1);
			not.setResult({some: "result"});
			assert.strictEqual(not.getVersion(), JR.version);
			assert.strictEqual(not.getId(), 1);
			assert.deepStrictEqual(not.getResult(), {some: "result"});
			assert.strictEqual(not.getError(), undefined);
		});
		it("constructor params with error", () => {
			const res = jr.Response({
				id: 1,
				error: {
					message: "some error",
					code: "0"
				}
			});
			assert.strictEqual(res.toString(), JSON.stringify({
				"version": JR.version,
				"id": 1,
				"error": {
					"code": "0",
					"message": "some error"
				}
			}));
			assert.deepStrictEqual(res.toJSON(), {
				id: 1,
				version: JR.version,
				error: new ExtError("0", "some error")
			});
		});
		it("methods with error", () => {
			const not = jr.Response();
			const error = new ExtError("0", "some message");
			not.setId(1);
			not.setError(error);
			assert.deepStrictEqual(not.toJSON(), {
				id: 1,
				version: JR.version,
				error
			});
		});
	});
});
