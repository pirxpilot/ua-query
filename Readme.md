[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]

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
-  `isChrome`
-  `isFirefox`
-  `isSafari`
-  `isIE`

-  `isBot` - some not all strange bots

-  `isOld(browser, version)` - true if broswer is older than specified version

OS:
-  `isWindowsXP`




## License

MIT © [Damian Krzeminski](https://code42day.com)

[npm-image]: https://img.shields.io/npm/v/ua-query.svg
[npm-url]: https://npmjs.org/package/ua-query

[travis-url]: https://travis-ci.org/code42day/ua-query
[travis-image]: https://img.shields.io/travis/code42day/ua-query.svg

[gemnasium-image]: https://img.shields.io/gemnasium/code42day/ua-query.svg
[gemnasium-url]: https://gemnasium.com/code42day/ua-query
