
process.env.NO_DEPRECATION = 'response-time'

var http = require('http');
var request = require('supertest');
var responseTime = require('..')

describe('responseTime()', function () {
  it('should send X-Response-Time header', function (done) {
    var server = createServer()
    request(server)
    .get('/')
    .expect('X-Response-Time', /^[0-9\.]+ms$/, done)
  })

  it('should not override X-Response-Time header', function (done) {
    var server = createServer(undefined, function(req, res) {
      res.setHeader('X-Response-Time', 'bogus')
    })

    request(server)
    .get('/')
    .expect('X-Response-Time', 'bogus', done)
  })

  describe('with "digits"', function () {
    it('should default to 3', function (done) {
      var server = createServer()
      request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9]+\.[0-9]{3}ms$/, done)
    })

    it('should allow custom digits', function (done) {
      var server = createServer(5)
      request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9]+\.[0-9]{5}ms$/, done)
    })

    it('should allow no digits', function (done) {
      var server = createServer(0)
      request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9]+ms$/, done)
    })
  })
})

describe('responseTime(options)', function () {
  describe('with "digits" option', function () {
    it('should default to 3', function (done) {
      var server = createServer()
      request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9]+\.[0-9]{3}ms$/, done)
    })

    it('should allow custom digits', function (done) {
      var server = createServer({ digits: 5 })
      request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9]+\.[0-9]{5}ms$/, done)
    })

    it('should allow no digits', function (done) {
      var server = createServer({ digits: 0 })
      request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9]+ms$/, done)
    })
  })

  describe('with "header" option', function () {
    it('should default to X-Response-Time', function (done) {
      var server = createServer()
      request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9\.]+ms$/, done)
    })

    it('should allow custom header name', function (done) {
      var server = createServer({ header: 'X-Time-Taken' })
      request(server)
      .get('/')
      .expect('X-Time-Taken', /^[0-9\.]+ms$/, done)
    })
  })

  describe('with "suffix" option', function () {
    it('should default to true', function (done) {
      var server = createServer()
      request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9\.]+ms$/, done)
    })

    it('should allow disabling suffix', function (done) {
      var server = createServer({ suffix: false })
      request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9\.]+$/, done)
    })
  })
})

function createServer(opts, fn) {
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
