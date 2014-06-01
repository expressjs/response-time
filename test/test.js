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
})

function createServer(ms) {
  var _responseTime = responseTime()

  ms = ms || 10

  return http.createServer(function (req, res) {
    _responseTime(req, res, function (err) {
      setTimeout(function () {
        res.statusCode = err ? (err.status || 500) : 200
        res.end(err ? err.message : 'OK')
      }, ms)
    })
  })
}
