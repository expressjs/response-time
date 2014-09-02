# response-time

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Gratipay][gratipay-image]][gratipay-url]

Response time middleware extracted from connect.

## Installation

```sh
$ npm install response-time
```

## API

```js
var responseTime = require('response-time')
```

### responseTime(digits)

Returns middleware that adds a `X-Response-Time` header to responses.

- `digits` - the fixed number of digits to include. (default: `3`)

## Examples

### express/connect

```js
var express = require('express')
var responseTime = require('response-time')

var app = express()

app.use(responseTime())

app.get('/', function (req, res) {
  res.send('hello, world!')
})
```

### vanilla http server

```js
var finalhandler = require('finalhandler')
var http = require('http')
var responseTime = require('response-time')

// create "middleware"
var _responseTime = responseTime()

http.createServer(function (req, res) {
  var done = finalhandler(req, res)
  _responseTime(req, res, function (err) {
    if (err) return done(err)

    // respond to request
    res.setHeader('content-type', 'text/plain')
    res.end('hello, world!')
  })
})
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/response-time.svg?style=flat
[npm-url]: https://npmjs.org/package/response-time
[travis-image]: https://img.shields.io/travis/expressjs/response-time.svg?style=flat
[travis-url]: https://travis-ci.org/expressjs/response-time
[coveralls-image]: https://img.shields.io/coveralls/expressjs/response-time.svg?style=flat
[coveralls-url]: https://coveralls.io/r/expressjs/response-time?branch=master
[downloads-image]: http://img.shields.io/npm/dm/response-time.svg?style=flat
[downloads-url]: https://npmjs.org/package/response-time
[gratipay-image]: https://img.shields.io/gratipay/dougwilson.svg?style=flat
[gratipay-url]: https://www.gratipay.com/dougwilson/
