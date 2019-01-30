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
	//MARK
	it.skip("not valid syntax", () => {
		assert.throws(() => {
			jr.Response({});
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
			assert.deepStrictEqual((jr.Response({
				id: 1,
				error: new ExtError({
					message: "some error",
					code: "0"
				})
			})).toJSON(), {
				id: 1,
				version: JR.version,
				error: new ExtError({
					message: "some error",
					code: "0"
				})
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
