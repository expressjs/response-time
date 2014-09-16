/*!
 * response-time
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var onHeaders = require('on-headers')

/**
 * Reponse time:
 *
 * Adds the `X-Response-Time` header displaying the response
 * duration in milliseconds.
 *
 * @param {number=} [digits=3]
 * @param {string=} optional custom header
 * @return {function}
 * @api public
 */

module.exports = function responseTime(digits, header) {
  digits = digits === undefined
    ? 3
    : digits
  header = (typeof header === 'string' && header.trim().length > 0)
    ? header
    : 'X-Response-Time'

  return function responseTime(req, res, next) {
    var startAt = process.hrtime()

    onHeaders(res, function () {
      if (this.getHeader(header)) return;

      var diff = process.hrtime(startAt),
        ms = diff[0] * 1e3 + diff[1] * 1e-6

      this.setHeader(header, ms.toFixed(digits) + 'ms')
    })

    next()
  }
}
