/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var jsonrpc = require(__dirname + '/../index.js');
var assert = require('assert');
describe('JsonRpcError', () => {
	describe('valid input', () => {
		it('constructor', () => {
			assert.equal(utls.getType(new jsonrpc.JsonRpcError('some message', 1)), "JsonRpcError")
		});
		it('setters & getters & isValid', () => {
			var err = new jsonrpc.JsonRpcError();
			err.setMessage('some message').setCode("code");
			assert.equal(err.getMessage(), 'some message');
			assert.equal(err.getCode(), "code");
			assert.equal(jsonrpc.JsonRpcError.isValid(err), true);
			assert.equal(jsonrpc.JsonRpcError.isValid({
				message : "some message",
				code : "code"
			}), true);
		});
	});
	describe('isvalid input', () => {
		it('setters & getters & isValid', () => {
			var err = new jsonrpc.JsonRpcError();
			assert.throws(() => {
				err.setMessage(false);
			});
			assert.throws(() => {
				err.setCode(true);
			});
			assert.equal(jsonrpc.JsonRpcError.isValid({
				message : false,
				code : true
			}), false);
		});
	});
});
