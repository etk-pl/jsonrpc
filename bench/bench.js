/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;
const JSONRPC = require('..');
const JSONLess = require('json-less');
JSONLess.addHandler(require('mongodb').ObjectID, (cls, value) => {
	return value.toString();
}, (cls, value) => {
	return new cls(value);
});
const objId = new (require('mongodb').ObjectID);
const date = new Date();
const req = new JSONRPC.Request({
	params : {
		date : date,
		oid : objId,
		some : "other values"
	},
	method : "someMeth",
	resource : "someRes"
});
const reqStr = req.toString();
suite.add('create request', function () {
	new JSONRPC.Request({
		params : {
			date : date,
			oid : objId,
			some : "other values"
		},
		method : "someMeth",
		resource : "someRes"
	});
}).add('stringify request', function () {
	req.toString();
}).add('create and stringifyrequest', function () {
	(new JSONRPC.Request({
		params : {
			date : date,
			oid : objId,
			some : "other values"
		},
		method : "someMeth",
		resource : "someRes"
	})).toString();
}).add('parse request', function () {
	JSONRPC.parse(reqStr);
}).on('cycle', function (event) {
	console.log(String(event.target));
}).run({'async' : true});
