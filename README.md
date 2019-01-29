# JsonRpc

[![Build Status](https://travis-ci.org/etk-pl/jsonrpc.svg?branch=master)](https://travis-ci.org/etk-pl/jsonrpc)
[![npm version](https://badge.fury.io/js/%40etk%2Fjsonrpc.svg)](https://badge.fury.io/js/%40etk%2Fjsonrpc)
[![Code Climate](https://codeclimate.com/github/etk-pl/jsonrpc/badges/gpa.svg)](https://codeclimate.com/github/etk-pl/jsonrpc)

## Schema
```javascript
{
	"version": string,
	"id": number,
	"resource": string,
	"method": string,
	"params": Object,
	"result": *,
	"error": {
		"code": string,
		"message": string
	}
}
```

## Usage

### New request
```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const request = jr.Request();
request.setResource('someResource').setMethod('methodName').setParams({'param1' : 'paramValue'});
console.log(request.toString());
// {"version":"1.2.0","id":1,"resource" : "someResource","method":"methodName","params":{"param1":"paramValue"}}
```
equals to
```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const request = jr.Request({
	resource : 'someResource',
	method : 'methodName',
	params : {param1 : 'paramValue'}
});
console.log(request.toString());
// {"version":"1.2.0","id":1,"resource" : "someResource","method":"methodName","params":{"param1":"paramValue"}}
```

### New response

#### with result

```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const response = jr.Response();
response.setId(1).setResult('someResult');
console.log(response.toString());
// {"version":"1.2.0","id":1,"result":"someResult"}
```
equals to
```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const request = jr.Request({
	id : 1,
	result : 'someResult'
});
console.log(request.toString());
// {"version":"1.2.0","id":1,"result":"someResult"}
```

#### with error

```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const response = jr.Response({
	id : 1,
	error : {
		code : "ERR_CODE",
		message : 'Error message'
	}
});
console.log(response.toString());
// {"version":"1.2.0","id":1,"error":{"code":"ERR_CODE","message":"Error message"}}
```
equals to
```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const response = jr.Response();
response.setId(1).setError({
	code : "ERR_CODE",
	message : 'Error message'
});
console.log(response.toString());
// {"version":"1.2.0","id":1,"error":{"code":"ERR_CODE","message":"Error message"}}
```
equals to
```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const response = jr.Response({
	id : 1,
	error : {
		code : "ERR_CODE",
		message : 'Error message'
	}
});
console.log(response.toString());
// {"version":"1.2.0","id":1,"error":{"code":"ERR_CODE","message":"Error message"}}
```

### New notification

```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const notification = jr.Notification();
notification.setResource('someResource').setMethod('methodName').setParams({'param1' : 'paramValue'});
console.log(notification.toString());
// {"version":"1.2.0","resource" : "someResource","method":"methodName","params":{"param1":"paramValue"}}
```
equals to
```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const notification = jr.Notification({
	resource : 'someResource',
	method : 'methodName',
	params : {param1 : 'paramValue'}
});
console.log(notification.toString());
// {"version":"1.2.0","resource" : "someResource","method":"methodName","params":{"param1":"paramValue"}}
```

### Parse message

```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const notification = jr.parse('{"version":"1.2.0","resource" : "someResource","method":"methodName","params":{"param1":"paramValue"}}');
console.log(notification.toString());
// {"version":"1.2.0","resource" : "someResource","method":"methodName","params":{"param1":"paramValue"}}
```

### Callbacks

```javascript
const JR = require("@etk/jsonrpc");
const jr = new JR;
const request = jr.Request();
request.setMethod('someMethod');
request.setCallback((res) => {
	console.log('Got response for message #' + request.getId());
	console.log(res);
});
console.log("Request", request);

const response = jr.Response();
response.setId(request.getId());
response.setResult({some : 'result'});
console.log("Response", response);

// Callback will fire automagicaly after response is parsed
jr.parse(response.toString());
```
output
```
Request JsonRpcRequest {
  message: 
   { version: '1.2.0',
     id: 1,
     resource: '__global__',
     params: {},
     method: 'someMethod' } }
     
Response JsonRpcResponse {
  message: { version: '1.2.0', id: 1, result: { some: 'result' } } }

Got response for message #1
JsonRpcResponse {
  message: { version: '1.2.0', id: 1, result: { some: 'result' } } }
```

### JSONLess

JSONLess allows non-primitives values like ```Date``` or MongoDB ```ObjectID``` to be transfered over JSON
See [JSONLess github.io pages](http://ponury-kostek.github.io/json-less/) for mor info 

## Docs

See [github.io pages](http://etk-pl.github.io/jsonrpc/) 
