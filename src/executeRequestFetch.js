'use strict'

function executeRequest (method, requestOptions, callback) {
  let corsProxy = 'https://cors-anywhere.herokuapp.com'
  if (typeof window.CORSPROXY !== 'undefined') {
    corsProxy = window.CORSPROXY
  }
  window.fetch(corsProxy + '/' + requestOptions.url, {
    method: method.toUpperCase(),
    headers: requestOptions.headers
  }).then((e) => {
    return e.json()
  }).then((d) => {
    callback(null, d)
  }).catch((e) => {
    callback(e)
  })
}

module.exports = executeRequest
