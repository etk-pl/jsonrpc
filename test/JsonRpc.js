/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
/* global describe, it*/
"use strict";
const JR = require(__dirname + "/../index.js");
const jr = new JR;
const ExtError = require("exterror");
const assert = require("assert");
describe("JsonRpc", () => {
	describe("invalid input", () => {
		const messages = [
			"incorrect string",
			{incorrect: "string"},
			true,
			"{\"version\" : \"1\", \"id\" : 1, \"resource\" : \"__global__\", \"method\": \"ping\", \"params\" : {}}",
			"{\"version\" : 1, \"id\" : 1, \"resource\" : \"__global__\", \"method\": \"ping\", \"params\" : {}}",
			"{\"version\" : \"" + JR.version + "\", \"id\" : \"1\", \"resource\" : \"__global__\", \"method\": \"ping\", \"params\" : {}}",
			"{\"version\" : \"" + JR.version + "\", \"id\" : 1, \"method\": \"ping\", \"params\" : {}}",
			"{\"version\" : \"" + JR.version + "\", \"id\" : 1, \"resource\" : \"__global__\", \"params\" : {}}",
			"{\"version\" : \"" + JR.version + "\", \"id\" : 1, \"resource\" : \"__global__\", \"method\": \"ping\"}",
			"{\"version\" : \"" + JR.version + "\", \"id\" : 1, \"resource\" : 1, \"method\": \"ping\", \"params\" : {}}",
			"{\"version\" : \"" + JR.version + "\", \"id\" : 1, \"resource\" : \"__global__\", \"method\": 1, \"params\" : {}}",
			"{\"version\" : \"" + JR.version + "\", \"id\" : 1, \"resource\" : \"__global__\", \"method\": \"ping\", \"params\" : 1}",
			"{\"version\" : \"" + JR.version + "\", \"method\": \"ping\", \"params\" : {}}",
			"{\"version\" : \"" + JR.version + "\", \"resource\" : \"__global__\", \"params\" : {}}",
			"{\"version\" : \"" + JR.version + "\", \"resource\" : \"__global__\", \"method\": \"ping\"}",
			"{\"version\" : \"" + JR.version + "\", \"resource\" : 1, \"method\": \"ping\", \"params\" : {}}",
			"{\"version\" : \"" + JR.version + "\", \"resource\" : \"__global__\", \"method\": 1, \"params\" : {}}",
			"{\"version\" : \"" + JR.version + "\", \"resource\" : \"__global__\", \"method\": \"ping\", \"params\" : 1}",
			"{\"version\" : \"" + JR.version + "\", \"id\" : 1, \"error\" : {\"code\":1, \"message\":1}}",
			"{\"version\" : \"" + JR.version + "\", \"id\" : \"1\", \"result\" : null, \"error\" : {\"code\":1, \"message\":\"msg\"}}"
		];
		messages.forEach((message, key) => {
			it("parse (#" + key + ")", () => {
				assert.throws(() => {
					jr.parse(message);
				});
			});
		});
		messages.forEach((message, key) => {
			it("hasValidSyntax (#" + key + ")", () => {
				assert.strictEqual(JR.hasValidSyntax(message), false);
			});
		});
	});
	describe("valid input", () => {
		const messages = [
			jr.options.encoder.stringify({
				version: JR.version,
				id: 1,
				result: null,
				error: new ExtError("code", "msg")
			}),
			"{\"version\":\"" + JR.version + "\",\"id\":1,\"result\":null}",
			"{\"version\":\"" + JR.version + "\",\"id\":1,\"error\":" + "{\"$type\":\"ExtError\",\"$value\":{\"code\":1,\"message\":\"msg\"}}" + "}",
			"{\"version\":\"" + JR.version + "\",\"id\":1,\"resource\":\"__global__\",\"method\":\"ping\",\"params\":{}}",
			"{\"version\":\"" + JR.version + "\",\"resource\":\"__global__\",\"method\":\"ping\",\"params\":{}}"
		];
		messages.forEach((message, key) => {
			it("parse (#" + key + ")", () => {
				assert.doesNotThrow(() => {
					jr.parse(message);
				});
			});
		});
		messages.forEach((message, key) => {
			it("hasValidSyntax (#" + key + ")", () => {
				message = jr.options.encoder.parse(message);
				assert.strictEqual(JR.hasValidSyntax(message), true);
			});
		});
		messages.forEach((message, key) => {
			it("parse stringify (#" + key + ")", () => {
				assert.strictEqual(jr.parse(message).toString(), message);
			});
		});
	});
	it("new JsonRpc not allowed", () => {
		assert.throws(() => {
			new jr();
		});
	});
	it.skip("set/getOptions", () => {
		const o = jr.getOptions(), no = {autoFireCallbacks: true};
		jr.setOptions(no);
		assert.deepStrictEqual(jr.getOptions(), no);
	});
	describe("getType", () => {
		it("valid input", () => {
			const req = jr.Request({method: "someMethod"}), res = jr.Response({
				id: 1,
				result: ""
			}), not = jr.Notification({method: "someMethod"});
			assert.strictEqual(JR.getType(req.toJSON()), "Request");
			assert.strictEqual(JR.getType(res.toJSON()), "Response");
			assert.strictEqual(JR.getType(not.toJSON()), "Notification");
		});
		it("invalid input", () => {
			assert.throws(() => {
				JR.getType();
			});
		});
	});
});
