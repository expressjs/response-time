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

  it('should send custom response time header', function (done) {
    var customHeader = 'X-Backend-Response-Time'
    var server = createServer(undefined, customHeader)
    request(server)
    .get('/')
    .expect(customHeader, /^[0-9\.]+ms$/, done)  
  })

  it('should not override X-Response-Time header', function (done) {
    var server = createServer(undefined, undefined, function(req, res) {
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

    it('should allow no digits', function (done) {
      var server = createServer(0)
      request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9]+ms$/, done)
    })
  })
})

function createServer(digits, header, fn) {
  var _responseTime = responseTime(digits, header)
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
