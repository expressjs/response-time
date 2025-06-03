/*!
 * response-time
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies
 * @private
 */

const onHeaders = require('on-headers')

/**
 * Module exports.
 * @public
 */

module.exports = responseTime

/**
 * Create a middleware to add a `X-Response-Time` header displaying
 * the response duration in milliseconds.
 *
 * @param {object|function} [options]
 * @param {number} [options.digits=3]
 * @param {string} [options.header=X-Response-Time]
 * @param {boolean} [options.suffix=true]
 * @return {function}
 * @public
 */

function responseTime (options) {
  const opts = options || {}

  // get the function to invoke
  const fn = typeof opts !== 'function'
    ? createSetHeader(opts)
    : opts

  return function responseTime (req, res, next) {
    const startAt = process.hrtime()

    onHeaders(res, function onHeaders () {
      const diff = process.hrtime(startAt)
      const time = diff[0] * 1e3 + diff[1] * 1e-6

      fn(req, res, time)
    })

    next()
  }
}

/**
 * Create function to set response time header.
 * @private
 */

function createSetHeader ({ digits = 3, header = 'X-Response-Time', suffix = true } = {}) {
  return function setResponseHeader (req, res, time) {
    if (res.getHeader(header)) return

    let val = time.toFixed(digits)
    if (suffix) val += 'ms'

    res.setHeader(header, val)
  }
}
