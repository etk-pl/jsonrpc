/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var jsonrpc = require(__dirname + '/../index.js');
var assert = require('assert');
describe('JsonRpc', () => {
	describe('invalid input', () => {
		var messages = [
			'incorrect string',
			{incorect : 'string'},
			true,
			'{"version" : "1", "id" : 1, "resource" : "__global__", "method": "ping", "params" : {}}',
			'{"version" : 1, "id" : 1, "resource" : "__global__", "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : "1", "resource" : "__global__", "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "resource" : "__global__", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "resource" : "__global__", "method": "ping"}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "resource" : 1, "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "resource" : "__global__", "method": 1, "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "resource" : "__global__", "method": "ping", "params" : 1}',
			'{"version" : "' + jsonrpc.version + '", "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "resource" : "__global__", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "resource" : "__global__", "method": "ping"}',
			'{"version" : "' + jsonrpc.version + '", "resource" : 1, "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "resource" : "__global__", "method": 1, "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "resource" : "__global__", "method": "ping", "params" : 1}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "error" : {"code":1, "message":1}}',
			'{"version" : "' + jsonrpc.version + '", "id" : "1", "result" : null, "error" : {"code":1, "message":"msg"}}'
		];
		messages.forEach((message, key) => {
			it('parse (#' + key + ')', () => {
				assert.throws(() => {
					jsonrpc.parse(message);
				});
			});
		});
		messages.forEach((message, key) => {
			it('hasValidSyntax (#' + key + ')', () => {
				assert.equal(jsonrpc.hasValidSyntax(message), false);
			});
		});
	});
	describe('valid input', () => {
		var messages = [
			JSON.stringify({
				version : jsonrpc.version,
				id : 1,
				result : null,
				error : {
					code : 1,
					message : "msg"
				}
			}),
			'{"version":"' + jsonrpc.version + '","id":1,"result":null}',
			'{"version":"' + jsonrpc.version + '","id":1,"error":{"code":"1","message":"msg"}}',
			'{"version":"' + jsonrpc.version + '","id":1,"resource":"__global__","method":"ping","params":{}}',
			'{"version":"' + jsonrpc.version + '","resource":"__global__","method":"ping","params":{}}'
		];
		messages.forEach((message, key) => {
			it('parse (#' + key + ')', () => {
				assert.doesNotThrow(() => {
					jsonrpc.parse(message);
				});
			});
		});
		messages.forEach((message, key) => {
			it('hasValidSyntax (#' + key + ')', () => {
				message = JSON.parse(message);
				assert.equal(jsonrpc.hasValidSyntax(message), true);
			});
		});
		messages.forEach((message, key) => {
			it('parse stringify (#' + key + ')', () => {
				assert.equal(jsonrpc.parse(message).toString(), message);
			});
		});
	});
	it('new JsonRpc not allowed', () => {
		assert.throws(() => {
			new jsonrpc();
		})
	});
	it('set/getOptions', () => {
		var o = jsonrpc.getOptions(), no = {autoFireCallbacks : true};
		jsonrpc.setOptions(no);
		assert.deepEqual(jsonrpc.getOptions(), no);
	});
	describe('getType', () => {
		it('valid input', () => {
			var req = new jsonrpc.Request({method : "someMethod"}), res = new jsonrpc.Response({id: 1, result : ''}), not = new jsonrpc.Notification({method : "someMethod"});

			assert.equal(jsonrpc.getType(req.toJSON()), "request");
			assert.equal(jsonrpc.getType(res.toJSON()), "response");
			assert.equal(jsonrpc.getType(not.toJSON()), "notification");
		});
		it('invalid input', () => {
			assert.throws(() => {
				jsonrpc.getType();
			});
		});
	});
});