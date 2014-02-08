var http = require('http');
var request = require('supertest');

var responseTime = require('..')();

describe('Response Time', function () {
  it('should set the response time header', function (done) {
    var server = http.createServer(function (req, res) {
      responseTime(req, res);
      setTimeout(function () {
        res.statusCode = 204;
        res.end();
      }, 10)
    })

    request(server)
    .get('/')
    .expect(204)
    .expect('X-Response-Time', /1[0-9]ms/)
    .end(done);
  })
})