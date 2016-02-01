// Credits: https://github.com/request/request/blob/master/lib/getProxyFromURI.js

import { parse, Url } from 'url'
import { Request } from 'popsicle'
import HttpProxyAgent = require('http-proxy-agent')
import HttpsProxyAgent = require('https-proxy-agent')

/**
 * Parsed results from `no_proxy` support.
 */
interface NoProxyValue {
  hostname: string
  port: string
}

/**
 * Support proxies with Popsicle.
 */
function proxy (options: proxy.Options = {}) {
  const getProxyAgent = createGetProxyAgent(options)

  return function (request: Request) {
    request.options.agent = getProxyAgent(request.Url)
  }
}

/**
 * Return a function that will create proxy agents based on the input URL.
 */
function createGetProxyAgent (options: proxy.Options) {
  const noProxy = options.noProxy || process.env.NO_PROXY || process.env.no_proxy

  if (noProxy === '*') {
    return (url: Url): void => undefined
  }

  const noProxyList = parseNoProxy(noProxy)
  const httpProxy = options.httpProxy || options.proxy || process.env.HTTP_PROXY || process.env.http_proxy
  const httpsProxy = options.httpsProxy || options.proxy || process.env.HTTPS_PROXY || process.env.https_proxy
  const httpProxyUrl = httpProxy ? parse(httpProxy) : undefined
  const httpsProxyUrl = httpsProxy ? parse(httpsProxy) : undefined

  return (url: Url) => {
    if (noProxy && urlInNoProxy(url, noProxyList)) {
      return
    }

    if (url.protocol === 'https:' && httpsProxy != null) {
      return new HttpsProxyAgent(httpsProxyUrl)
    }

    return httpProxy ? new HttpProxyAgent(httpProxyUrl) : undefined
  }
}

/**
 * Normalize hostname for matching.
 */
function formatHostname (hostname: string) {
  return hostname.replace(/^\.*/, '.').toLowerCase()
}

/**
 * Parse the no proxy string into an array.
 */
function parseNoProxy (noProxy: string): NoProxyValue[] {
  if (!noProxy) {
    return []
  }

  return noProxy.split(',').map(zone => {
    const location = zone.trim().toLowerCase()
    const parts = location.split(':', 2)
    const hostname = formatHostname(parts[0])
    const port = parts[1]

    return { hostname, port }
  })
}

/**
 * Check if a url is in the no proxy configuration.
 */
function urlInNoProxy (url: Url, noProxyList: NoProxyValue[]) {
  const hostname = formatHostname(url.hostname)
  const port = url.port || (url.protocol === 'https:' ? '443' : '80')

  return noProxyList.some(noProxy => {
    const isMatchedAt = hostname.indexOf(noProxy.hostname)
    const hostnameMatched = isMatchedAt > -1 && isMatchedAt === hostname.length - noProxy.hostname.length

    if (noProxy.port != null) {
      return hostnameMatched && port === noProxy.port
    }

    return hostnameMatched
  })
}

namespace proxy {
  /**
   * Proxy options mirror standard environment variables.
   */
  export interface Options {
    proxy?: string
    httpProxy?: string
    httpsProxy?: string
    noProxy?: string
  }
}

export = proxy
