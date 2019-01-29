/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
/* global describe, it*/
"use strict";
const {uc_first} = require("../src/common");
const JR = require(__dirname + "/../index.js");
const jr = new JR;
const assert = require("assert");
describe("JsonRpcNotification", () => {
	it("invalid message type", () => {
		assert.throws(() => {
			jr.Notification("");
		});
	});
	//MARK realy?
	it.skip("not valid syntax", () => {
		assert.throws(() => {
			jr.Notification({});
		});
	});
	it("defaults", () => {
		const not = jr.Notification();
		assert.strictEqual(not.getVersion(), JR.version);
		assert.strictEqual(not.getResource(), "__global__");
		assert.deepStrictEqual(not.getParams(), {});
	});
	describe("restricted methods", () => {
		const obj = jr.Notification();
		const methods = "id,result,error".split(",");
		//MARK
		it.skip("setVersion", () => {
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
		it("constructor params", () => {
			assert.deepStrictEqual((jr.Notification({
				resource: "someResource",
				method: "someMethod",
				params: {some: "params"}
			})).toJSON(), {
				version: JR.version,
				resource: "someResource",
				method: "someMethod",
				params: {"some": "params"}
			});
		});
		it("methods", () => {
			const not = jr.Notification();
			not.setResource("someResource");
			not.setMethod("someMethod");
			not.setParams({some: "params"});
			assert.strictEqual(not.getResource(), "someResource");
			assert.strictEqual(not.getMethod(), "someMethod");
			assert.deepStrictEqual(not.getParams(), {some: "params"});
		});
	});
});
