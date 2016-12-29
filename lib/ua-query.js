// User agent parsing tools


module.exports = {
  isWindowsXP: isWindowsXP,
  isChrome: check.bind(null, 'chrome'),
  isFirefox: check.bind(null, 'firefox'),
  isSafari: check.bind(null, 'safari'),
  isIE: check.bind(null, 'ie'),
  isBot: check.bind(null, 'bot'),
  isOld: isOld
};

var RE = {
  chrome: /(?:chromium|crios|chrome)\/(\d\d)(?!.*edge)/i,
  firefox: /Firefox\/(\d\d)/,
  safari: /Version\/(\d+).+Safari\//i,
  ie: /MSIE\s(\d+)/,
  bot: /(?:BingPreview|YandexBot|Googlebot)\/(\d+)/i
};

function isWindowsXP(req) {
  var ua = req.headers['user-agent'];
  return (ua && ua.indexOf('Windows NT 5.1') !== -1);
}

function getVersion(regex, req) {
  var ua, match, version;

  req._ua_cache = req._ua_cache || {};

  if (regex in req._ua_cache) {
    return req._ua_cache[regex];
  }

  ua = req.headers['user-agent'];
  match = RE[regex].exec(ua);

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
