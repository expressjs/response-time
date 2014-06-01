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
    var server = createServer(10, function(req, res) {
      res.setHeader('X-Response-Time', 'bogus')
    })

    request(server)
    .get('/')
    .expect('X-Response-Time', 'bogus', done)
  })
})

function createServer(ms, fn) {
  var _responseTime = responseTime()

  ms = ms || 10

  return http.createServer(function (req, res) {
    _responseTime(req, res, function (err) {
      setTimeout(function () {
        fn && fn(req, res)
        res.statusCode = err ? (err.status || 500) : 200
        res.end(err ? err.message : 'OK')
      }, ms)
    })
  })
}
