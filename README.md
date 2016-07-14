# Popsicle Proxy Agent

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Generic proxy agent (for Popsicle and node.js).

## Installation

```sh
npm install popsicle-proxy-agent --save
```

## Usage

```js
var popsicle = require('popsicle')
var createProxy = require('popsicle-proxy-agent')

var proxy = createProxy({
  proxy: '...'
})

popsicle.get({
  url: 'http://example.com',
  transport: popsicle.createTransport({
    agent: proxy('http://example.com')
  })
})
```

### Options

* **proxy** The default HTTP(s) proxy to use
* **httpProxy** The proxy for HTTP requests (default: `process.env.HTTP_PROXY`)
* **httpsProxy** The proxy for HTTPS requests (default: `process.env.HTTPS_PROXY`)
* **noProxy** A string of space-separated hosts to not proxy (default: `process.env.NO_PROXY`)

## License

Apache 2.0

[npm-image]: https://img.shields.io/npm/v/popsicle-proxy-agent.svg?style=flat
[npm-url]: https://npmjs.org/package/popsicle-proxy-agent
[downloads-image]: https://img.shields.io/npm/dm/popsicle-proxy-agent.svg?style=flat
[downloads-url]: https://npmjs.org/package/popsicle-proxy-agent
[travis-image]: https://img.shields.io/travis/blakeembrey/popsicle-proxy-agent.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/popsicle-proxy-agent
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/popsicle-proxy-agent.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/popsicle-proxy-agent?branch=master
