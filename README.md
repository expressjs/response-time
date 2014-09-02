# response-time

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Response time middleware extracted from connect.

## Installation

```sh
$ npm install response-time
```

## API

```js
var responseTime = require('response-time')

// time starts ticking from the moment req goes through the middleware
app.use(responseTime(5))
```

### responseTime(digits)

Returns middleware that adds a `X-Response-Time` header to responses.

- `digits` - the fixed number of digits to include. (default: `3`)

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
