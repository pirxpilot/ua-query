var should = require('should');
var ua = require('..');
var UA = require('./ua-strings.js');

function r(ua) {
  return {
    'headers': {
      'user-agent': UA[ua] || ua
    }
  };
}

describe('ua query', function () {

  it('should not detect Windows XP if user-agent is missing', function() {
    should(
      ua.isWindowsXP(r(''))
    ).not.be.ok();
  });

  it('should not detect Windows XP on Linux or MAC', function() {
    should(
      ua.isWindowsXP(r('linux-firefox-41'))
    ).not.be.ok();
    should(
      ua.isWindowsXP(r('safari-7'))
    ).not.be.ok();
  });

  it('should detect Windows XP on Windows XP', function() {
    should(
      ua.isWindowsXP(r('windows-xp-chrome-35'))
    ).be.ok();
  });

  it('should not detect Chrome if user-agent is missing', function() {
    should(
      ua.isChrome(r())
    ).not.be.ok();
  });

  it('should not detect Chrome if other browsers', function() {
    should(
      ua.isChrome(r('linux-firefox-41'))
    ).not.be.ok();

    should(
      ua.isChrome(r('windows-edge-12'))
    ).not.be.ok();

    should(
      ua.isChrome(r('windows-edge-79'))
    ).not.be.ok();

    should(
      ua.isChrome(r('safari-7'))
    ).not.be.ok();

    should(
      ua.isChrome(r('chrome ios'))
    ).not.be.ok();
  });

  it('should detect Chrome', function() {
    should(
      ua.isChrome(r('windows-xp-chrome-35'))
    ).be.ok();
    should(
      ua.isChrome(r('chromium'))
    ).be.ok();
  });

  it('ua should detect Chrome iOS', function() {
    should(
      ua.isChrome_iOS(r('chrome ios'))
    ).be.ok();
  });

  it('should detect Firefox', function() {
    should(
      ua.isFirefox(r('linux-firefox-41'))
    ).be.ok();
  });

  it('should detect Safari', function() {
    should(
      ua.isSafari(r('safari-7'))
    ).be.ok();
    should(
      ua.isSafari(r('safari-7', 6))
    ).be.ok();
    should(
      ua.isSafari(r('safari-7', 7))
    ).be.ok();
    should(
      ua.isSafari(r('mobile-safari-10'), 10)
    ).be.ok();
    should(
      ua.isOld(r('safari-7'), 'safari', 8)
    ).be.ok();
  });

  it('should not detect Safari if other browsers', function() {
    should(
      ua.isSafari(r('mac-chrome-41'))
    ).not.be.ok();
    should(
      ua.isSafari(r('windows-xp-chrome-35'))
    ).not.be.ok();
    should(
      ua.isSafari(r('linux-firefox-41'))
    ).not.be.ok();
    should(
      ua.isSafari(r('windows-edge-12'))
    ).not.be.ok();
    should(
      ua.isSafari(r('windows-edge-79'))
    ).not.be.ok();
    should(
      ua.isSafari(r('standalone-ios'))
    ).not.be.ok();
  });

  it('should parse headers once', function() {
    var req = r('linux-firefox-41');
    should(ua.isFirefox(req, 41)).be.ok();
    should(ua.isChrome(req, 35)).not.be.ok();

    req.headers = UA['windows-xp-chrome-35'];
    should(ua.isFirefox(req, 41)).be.ok();
    should(ua.isChrome(req, 35)).not.be.ok();
  });

  it('should not detect Firefox if Chrome', function() {
    should(
      ua.isFirefox(r('windows-xp-chrome-35'))
    ).not.be.ok();
  });

  it('should detect Chrome if requested version is the same', function() {
    should(
      ua.isChrome(r('windows-xp-chrome-35'), 35)
    ).be.ok();
    should(
      ua.isChrome(r('chromium'), 38)
    ).be.ok();
    should(
      ua.isChrome(r('chrome-100'), 100)
    ).be.ok();
    should(
      ua.isChrome(r('android-chrome-reduced'), 93)
    ).be.ok();
  });

  it('should not detect Chrome if requested version is above what we have', function() {
    should(
      ua.isChrome(r(
        'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.3319.102 Safari/537.36'
      ), 36)
    ).not.be.ok();
  });

  it('should detect IE <= 10', function() {
    should(
      ua.isIE(r('windows-ie-9'))
    ).be.ok();
    should(
      ua.isIE(r('windows-ie-10'), 10)
    ).be.ok();
    should(
      ua.isIE(r('windows-ie-10'), 11)
    ).be.not.ok();
  });

  it('should detect IE 11', function() {
    should(
      ua.isIE(r('windows-ie-11'))
    ).be.ok();
    should(
      ua.isIE(r('windows-ie-11'), 10)
    ).be.ok();
    should(
      ua.isIE(r('windows-ie-11'), 11)
    ).be.ok();
  });

  it('should detect Edge', function() {
    should(
      ua.isEdge(r('windows-edge-12'))
    ).be.ok();
    should(
      ua.isEdge(r('windows-edge-12'), 12)
    ).be.ok();
    should(
      ua.isEdge(r('windows-edge-79'))
    ).be.ok();
    should(
      ua.isEdge(r('windows-edge-79'), 79)
    ).be.ok();
    should(
      ua.isEdge(r('windows-ie-11'))
    ).be.not.ok();
  });

  it('should check for old browser version', function() {
    var req = r('windows-xp-chrome-35');

    should(ua.isOld(req, 'chrome', 36)).be.ok();
    should(ua.isOld(req, 'chrome', 35)).not.be.ok();
    should(ua.isOld(req, 'chrome', 34)).not.be.ok();

    should(ua.isOld(req, 'safari', 36)).not.be.ok();
    should(ua.isOld(req, 'ie', 36)).not.be.ok();
    should(ua.isOld(req, 'firefox', 36)).not.be.ok();
  });

  it('should detect bot for BingPreview', function() {
    should(
      ua.isBot(r('bing'))
    ).be.ok();
    should(
      ua.isBot(r('mac-chrome-41'))
    ).not.be.ok();
  });

  it('should detect android', function() {
    should(
      ua.isAndroid(r('android-firefox'))
    ).be.ok();
    should(
      ua.isAndroid(r('android-chrome'))
    ).be.ok();
    should(
      ua.isAndroid(r('android-chrome-reduced'))
    ).be.ok();
  });

  it('should not detect android if other OSes', function() {
    should(
      ua.isAndroid(r('mobile-safari-10'))
    ).not.be.ok();
    should(
      ua.isAndroid(r('windows-ie-11'))
    ).not.be.ok();
  });

  it('should detect iOS', function() {
    should(
      ua.is_iOS(r('mobile-safari-10'))
    ).be.ok();
    should(
      ua.is_iOS(r('standalone-ios'))
    ).be.ok();
  });

  it('should not detect iOS if other OSes', function() {
    should(
      ua.is_iOS(r('android-chrome'))
    ).not.be.ok();
    should(
      ua.is_iOS(r('edge-mobile'))
    ).not.be.ok();
  });

  it('should detect Windows Phone', function() {
    should(
      ua.isWindowsPhone(r('edge-mobile'))
    ).be.ok();
  });

  it('should not detect Windows Phone if other OSes', function() {
    should(
      ua.isWindowsPhone(r('windows-edge-12'))
    ).not.be.ok();
    should(
      ua.isWindowsPhone(r('windows-edge-79'))
    ).not.be.ok();
  });

});
