
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
    var start = Date.now();
    res._responseTime = true;

    onHeaders(res, function () {
      var duration = Date.now() - start
      this.setHeader('X-Response-Time', duration + 'ms')
    })

    next();
  };
};

function noop() {}
