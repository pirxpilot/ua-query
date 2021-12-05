[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

# ua-query

Lazy user agent string checker for connect compatible requests

## Install

```sh
$ npm install --save ua-query
```

## Usage

```js
var ua = require('ua-query');

function middleware(req, res, next) {
  if (ua.isChrome(req, 45) || ua.isFirefox(req, 40)) {
    res.locals.polyfills = false;
  }
}
```

## API

`ua-query` functions take request as the first parameter and optionally version number as the second.

browsers:
- `isChrome(req[, version])`
- `isFirefox(req[, version])`
- `isSafari(req[, version])`
- `isIE(req[, version])`
- `isEdge(req[, version])`
- `isBot(req[, version])` - a few strange bots


- `isOld(browser, version)` - true if browser type matches but the version is older than specified version

OS:
- `isWindowsXP(req)`


## In-browser usage

When used in the browser `ua-query` will check self.navigator.userAgent. Browser-side API is similar to
server-side API but it skips `req` parameter.

```js
var ua = require('ua-query');

function isModern(req, res, next) {
  return ua.isChrome(45) || ua.isFirefox(40);
}
```


## License

MIT © [Damian Krzeminski](https://pirxpilot.me)

[npm-image]: https://img.shields.io/npm/v/ua-query.svg
[npm-url]: https://npmjs.org/package/ua-query

[travis-url]: https://travis-ci.org/pirxpilot/ua-query
[travis-image]: https://img.shields.io/travis/pirxpilot/ua-query.svg
