import { request } from 'popsicle'
import { parse } from 'url'
import test = require('blue-tape')
import serverAddress = require('server-address')
import proxy = require('./index')

test('popsicle proxy', t => {
  let server: serverAddress.ServerAddress
  let proxyServer: serverAddress.ServerAddress

  t.test('before', t => {
    proxyServer = serverAddress(function (req, res) {
      res.end('proxy ' + req.url)
    })

    server = serverAddress(function (req, res) {
      res.end('server ' + req.url)
    })

    server.listen()
    proxyServer.listen()

    t.end()
  })

  t.test('use proxy option', t => {
    return request(server.url())
      .use(proxy({ proxy: proxyServer.url() }))
      .then(function (res) {
        t.equal(res.status, 200)
        t.equal(res.body, 'proxy ' + server.url())
      })
  })

  t.test('support no proxy', t => {
    return request(server.url())
      .use(proxy({ proxy: proxyServer.url(), noProxy: parse(server.url()).hostname }))
      .then(function (res) {
        t.equal(res.status, 200)
        t.equal(res.body, 'server /')
      })
  })

  t.test('after', t => {
    server.close()
    proxyServer.close()

    t.end()
  })
})
