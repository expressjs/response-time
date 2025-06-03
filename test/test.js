process.env.NO_DEPRECATION = 'response-time'

const after = require('after')
const assert = require('assert')
const http = require('http')
const request = require('supertest')
const responseTime = require('..')

describe('responseTime()', function () {
  // Set the timeout to 5 seconds or the ci tests will randomly fail on windows due to timeouts
  this.timeout(5000)

  it('should send X-Response-Time header', function (done) {
    const server = createServer()
    request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9.]+ms$/, done)
  })

  it('should not override X-Response-Time header', function (done) {
    const server = createServer(undefined, function (req, res) {
      res.setHeader('X-Response-Time', 'bogus')
    })

    request(server)
      .get('/')
      .expect('X-Response-Time', 'bogus', done)
  })

  it('should default to 3 digits', function (done) {
    const server = createServer()
    request(server)
      .get('/')
      .expect('X-Response-Time', /^[0-9]+\.[0-9]{3}ms$/, done)
  })
})

describe('responseTime(fn)', function () {
  it('should call fn with response time', function (done) {
    const cb = after(2, done)
    const start = process.hrtime()
    const server = createServer(function (req, res, time) {
      const diff = process.hrtime(start)
      const max = diff[0] * 1e3 + diff[1] * 1e-6
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
    const cb = after(2, done)
    const server = createServer(function () {
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
      const server = createServer()
      request(server)
        .get('/')
        .expect('X-Response-Time', /^[0-9.]+ms$/, done)
    })

    it('should allow custom header name', function (done) {
      const server = createServer({ header: 'X-Time-Taken' })
      request(server)
        .get('/')
        .expect('X-Time-Taken', /^[0-9.]+ms$/, done)
    })
  })

  describe('with "suffix" option', function () {
    it('should default to true', function (done) {
      const server = createServer()
      request(server)
        .get('/')
        .expect('X-Response-Time', /^[0-9.]+ms$/, done)
    })

    it('should allow disabling suffix', function (done) {
      const server = createServer({ suffix: false })
      request(server)
        .get('/')
        .expect('X-Response-Time', /^[0-9.]+$/, done)
    })
  })
})

function createServer (opts, fn) {
  const _responseTime = responseTime(opts)
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
