var getPorts = require('./')
var test = require('tape')
var net = require('net')

test('gets multiple open ports', function (t) {
  t.plan(1)
  var server = net.createServer()
  server.listen(8000, function () {
    getPorts([ 8000, 8000 ], function (err, ports) {
      server.close()
      if (err) return t.fail(err)
      t.deepEqual(ports, [ 8001, 8002 ], 'gets next available ports')
    })
  })
})

test('failure cases', function (t) {
  t.throws(function () {
    getPorts(null)
  }, 'invalid params')
  t.throws(function () {
    getPorts([ 2000 ], Infinity, function(){})
  }, 'invalid maxPort')
  t.throws(function () {
    getPorts([ 2000 ], 8000, null)
  }, 'invalid cb')
  t.end()
})

test('gets multiple open ports', function (t) {
  t.plan(1)
  var server = net.createServer()
  server.listen(8000, function () {
    var server2 = net.createServer()
    server2.listen(8001, function () {
      getPorts([ 8001, 8000 ], function (err, ports) {
        server.close()
        server2.close()
        if (err) return t.fail(err)
        t.deepEqual(ports, [ 8002, 8003 ], 'gets next available ports')
      })
    })
  })
})

test('gets multiple open ports', function (t) {
  t.plan(1)
  var server = net.createServer()
  server.listen(59998, function () {
    getPorts([ 59998 ], function (err, ports) {
      server.close()
      if (err) return t.fail(err)
      t.deepEqual(ports, [ 59999 ], 'gets next available ports')
    })
  })
})

test('accepts range', function (t) {
  t.plan(1)
  var server = net.createServer()
  server.listen(8005, function () {
    getPorts([ 8005, 8005 ], 8007, function (err, ports) {
      server.close()
      if (!err) return t.fail(new Error('expected error, not ports ' + ports))
      t.ok(err instanceof Error, 'no open ports within range')
    })
  })
})

test('returns error when out of ports', function (t) {
  t.plan(1)
  var server = net.createServer()
  server.listen(59998, function () {
    getPorts([ 59998, 59998 ], function (err, ports) {
      server.close()
      if (!err) return t.fail(new Error('expected error, not ' + ports))
      t.ok(err instanceof Error, 'out of ports')
    })
  })
})
