
/*!
 * Connect - responseTime
 * Copyright(c) 2011 TJ Holowaychuk
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
 * @return {Function}
 * @api public
 */

module.exports = function responseTime(){
  return function(req, res, next){
    next = next || noop;
    if (res._responseTime) return next();
    res._responseTime = true;

    var startAt = process.hrtime()

    onHeaders(res, function () {
      var diff = process.hrtime(startAt)
      var ms = diff[0] * 1e3 + diff[1] * 1e-6
      this.setHeader('X-Response-Time', ms.toFixed(3) + 'ms')
    })

    next();
  };
};

function noop() {}
