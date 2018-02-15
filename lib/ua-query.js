// User agent parsing tools

/* global self:false */

var getUserAgent = isBrowser() ? navigatorUA : requestUA;
var bind = isBrowser() ? bindNavigator : bindRequest;

module.exports = {
  isChrome: bind(check, 'chrome'),
  isChrome_iOS: bind(check, 'crios'),
  isFirefox: bind(check, 'firefox'),
  isSafari: bind(check, 'safari'),
  isIE: bind(check, 'ie'),
  isEdge: bind(check, 'edge'),
  isBot: bind(check, 'bot'),
  isStandalone_iOS: bind(check, 'standalone_iOS'),
  is_iOS: bind(check, 'iOS'),
  isAndroid: bind(check, 'android'),
  isWindowsPhone: bind(check, 'windows_phone'),
  isOld: isBrowser() ? isOld.bind(null, self.navigator) : isOld,
  isWindowsXP: isBrowser() ? isWindowsXP.bind(null, self.navigator) : isWindowsXP
};

var RE = {
  crios: /crios\/(\d\d)(?!.*edge)/i,
  chrome: /(?:chromium|chrome)\/(\d\d)(?!.*edge)/i,
  firefox: /Firefox\/(\d\d)/,
  safari: /Version\/(\d+).+Safari\//i,
  ie: /(?:MSIE\s|Windows.+Trident\/7.+rv:)(\d+)/,
  edge: /Windows.+Edge\/(\d+)/,

  bot: /(?:BingPreview|YandexBot|Googlebot)\/(\d+)/i,
  standalone_iOS: /(?:iPhone|iPad|iPod) OS (\d+)[_\s](?!.*safari|crios)/i,

  windows_phone: /windows phone (\d+)/i,
  iOS: /(?:iPhone|iPad|iPod) OS (\d+)/i,
  android: /android (\d+)/i,
};


function isWindowsXP(req) {
  var ua = getUserAgent(req);
  return (ua && ua.indexOf('Windows NT 5.1') !== -1);
}

function getVersion(regex, req) {
  req._ua_cache = req._ua_cache || {};

  if (regex in req._ua_cache) {
    return req._ua_cache[regex];
  }

  var match = RE[regex].exec(getUserAgent(req));
  var version;

  if (match) {
    version = parseInt(match[1], 10);
  }

  req._ua_cache[regex] = version;
  return version;
}

function check(regex, req, requestedVersion) {
  var version = getVersion(regex, req);

  // version undefined, 0, false - means not detected
  if (!version) {
    return;
  }

  if (typeof requestedVersion !== 'number') {
    return true;
  }

  return version >= requestedVersion;
}

function isOld(req, regex, minVersion) {
  var is = check(regex, req, minVersion);

  if (is === undefined) {
    // undefined means it's not this type of browser
    return;
  }

  return !is;
}

function navigatorUA(navigator) {
  return navigator.userAgent;
}

function requestUA(req) {
  return req.headers['user-agent'];
}

function bindRequest(fn, regex) {
  return fn.bind(null, regex);
}

function bindNavigator(fn, regex) {
  return fn.bind(null, regex, self.navigator);
}

function isBrowser() {
  return typeof self !== 'undefined' && 'userAgent' in self.navigator;
}

