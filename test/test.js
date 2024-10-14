
process.env.NO_DEPRECATION = 'response-time'

var after = require('after')
var assert = require('assert')
var http = require('http')
var request = require('supertest')
var responseTime = require('..')

describe('responseTime()', function () {
  it('should send X-Response-Time header', function (done) {
    var server = createServer()
    request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9.]+ms$/, done)
  })

  it('should not override X-Response-Time header', function (done) {
    var server = createServer(undefined, function (req, res) {
      res.setHeader('X-Response-Time', 'bogus')
    })

    request(server)
      .get('/')
      .expect('X-Response-Time', 'bogus', done)
  })

  it('should default to 3 digits', function (done) {
    var server = createServer()
    request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9]+\.[0-9]{3}ms$/, done)
  })
})

describe('responseTime(fn)', function () {
  it('should call fn with response time', function (done) {
    var cb = after(2, done)
    var start = process.hrtime()
    var server = createServer(function (req, res, time) {
      var diff = process.hrtime(start)
      var max = diff[0] * 1e3 + diff[1] * 1e-6
      assert.equal(req.url, '/')
      assert.equal(res.statusCode, 200)
      assert.ok(time >= 0)
      assert.ok(time <= max)
      cb()
    })

    request(server)
      .get('/')
      .expect(200, cb)
  })

  it('should not send X-Response-Time header', function (done) {
    var cb = after(2, done)
    var server = createServer(function () {
      cb()
    })

    request(server)
      .get('/')
      .expect(shouldNotHaveHeader('X-Response-Time'))
      .expect(200, cb)
  })
})

describe('responseTime(options)', function () {
  describe('with "header" option', function () {
    it('should default to X-Response-Time', function (done) {
      var server = createServer()
      request(server)
        .get('/')
        .expect('X-Response-Time', /^[0-9.]+ms$/, done)
    })

    it('should allow custom header name', function (done) {
      var server = createServer({ header: 'X-Time-Taken' })
      request(server)
        .get('/')
        .expect('X-Time-Taken', /^[0-9.]+ms$/, done)
    })
  })

  describe('with "suffix" option', function () {
    it('should default to true', function (done) {
      var server = createServer()
      request(server)
        .get('/')
        .expect('X-Response-Time', /^[0-9.]+ms$/, done)
    })

    it('should allow disabling suffix', function (done) {
      var server = createServer({ suffix: false })
      request(server)
        .get('/')
        .expect('X-Response-Time', /^[0-9.]+$/, done)
    })
  })
})

function createServer (opts, fn) {
  var _responseTime = responseTime(opts)
  return http.createServer(function (req, res) {
    _responseTime(req, res, function (err) {
      setTimeout(function () {
        fn && fn(req, res)
        res.statusCode = err ? (err.status || 500) : 200
        res.end(err ? err.message : 'OK')
      }, 10)
    })
  })
}

function shouldNotHaveHeader (header) {
  return function (res) {
    assert.ok(!(header.toLowerCase() in res.headers), 'should not have header ' + header)
  }
}
