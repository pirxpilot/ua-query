const { describe, it } = require('node:test');
const ua = require('..');
const UA = require('./ua-strings.js');

function r(ua) {
  return {
    headers: {
      'user-agent': UA[ua] || ua
    }
  };
}

describe('ua query', () => {
  it('should not detect Windows XP if user-agent is missing', t => {
    t.assert.ok(!ua.isWindowsXP(r('')));
  });

  it('should not detect Windows XP on Linux or MAC', t => {
    t.assert.ok(!ua.isWindowsXP(r('linux-firefox-41')));
    t.assert.ok(!ua.isWindowsXP(r('safari-7')));
  });

  it('should detect Windows XP on Windows XP', t => {
    t.assert.ok(ua.isWindowsXP(r('windows-xp-chrome-35')));
  });

  it('should not detect Chrome if user-agent is missing', t => {
    t.assert.ok(!ua.isChrome(r()));
  });

  it('should not detect Chrome if other browsers', t => {
    t.assert.ok(!ua.isChrome(r('linux-firefox-41')));

    t.assert.ok(!ua.isChrome(r('windows-edge-12')));

    t.assert.ok(!ua.isChrome(r('windows-edge-79')));

    t.assert.ok(!ua.isChrome(r('safari-7')));

    t.assert.ok(!ua.isChrome(r('chrome ios')));
  });

  it('should detect Chrome', t => {
    t.assert.ok(ua.isChrome(r('windows-xp-chrome-35')));
    t.assert.ok(ua.isChrome(r('chromium')));
  });

  it('ua should detect Chrome iOS', t => {
    t.assert.ok(ua.isChrome_iOS(r('chrome ios')));
  });

  it('should detect Firefox', t => {
    t.assert.ok(ua.isFirefox(r('linux-firefox-41')));
  });

  it('should detect Safari', t => {
    t.assert.ok(ua.isSafari(r('safari-7')));
    t.assert.ok(ua.isSafari(r('safari-7', 6)));
    t.assert.ok(ua.isSafari(r('safari-7', 7)));
    t.assert.ok(ua.isSafari(r('mobile-safari-10'), 10));
    t.assert.ok(ua.isOld(r('safari-7'), 'safari', 8));
  });

  it('should not detect Safari if other browsers', t => {
    t.assert.ok(!ua.isSafari(r('mac-chrome-41')));
    t.assert.ok(!ua.isSafari(r('windows-xp-chrome-35')));
    t.assert.ok(!ua.isSafari(r('linux-firefox-41')));
    t.assert.ok(!ua.isSafari(r('windows-edge-12')));
    t.assert.ok(!ua.isSafari(r('windows-edge-79')));
    t.assert.ok(!ua.isSafari(r('standalone-ios')));
  });

  it('should parse headers once', t => {
    const req = r('linux-firefox-41');
    t.assert.ok(ua.isFirefox(req, 41));
    t.assert.ok(!ua.isChrome(req, 35));

    req.headers = UA['windows-xp-chrome-35'];
    t.assert.ok(ua.isFirefox(req, 41));
    t.assert.ok(!ua.isChrome(req, 35));
  });

  it('should not detect Firefox if Chrome', t => {
    t.assert.ok(!ua.isFirefox(r('windows-xp-chrome-35')));
  });

  it('should detect Chrome if requested version is the same', t => {
    t.assert.ok(ua.isChrome(r('windows-xp-chrome-35'), 35));
    t.assert.ok(ua.isChrome(r('chromium'), 38));
    t.assert.ok(ua.isChrome(r('chrome-100'), 100));
    t.assert.ok(ua.isChrome(r('android-chrome-reduced'), 93));
  });

  it('should not detect Chrome if requested version is above what we have', t => {
    t.assert.ok(
      !ua.isChrome(
        r('Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.3319.102 Safari/537.36'),
        36
      )
    );
  });

  it('should detect IE <= 10', t => {
    t.assert.ok(ua.isIE(r('windows-ie-9')));
    t.assert.ok(ua.isIE(r('windows-ie-10'), 10));
    t.assert.ok(!ua.isIE(r('windows-ie-10'), 11));
  });

  it('should detect IE 11', t => {
    t.assert.ok(ua.isIE(r('windows-ie-11')));
    t.assert.ok(ua.isIE(r('windows-ie-11'), 10));
    t.assert.ok(ua.isIE(r('windows-ie-11'), 11));
  });

  it('should detect Edge', t => {
    t.assert.ok(ua.isEdge(r('windows-edge-12')));
    t.assert.ok(ua.isEdge(r('windows-edge-12'), 12));
    t.assert.ok(ua.isEdge(r('windows-edge-79')));
    t.assert.ok(ua.isEdge(r('windows-edge-79'), 79));
    t.assert.ok(!ua.isEdge(r('windows-ie-11')));
  });

  it('should check for old browser version', t => {
    const req = r('windows-xp-chrome-35');

    t.assert.ok(ua.isOld(req, 'chrome', 36));
    t.assert.ok(!ua.isOld(req, 'chrome', 35));
    t.assert.ok(!ua.isOld(req, 'chrome', 34));

    t.assert.ok(!ua.isOld(req, 'safari', 36));
    t.assert.ok(!ua.isOld(req, 'ie', 36));
    t.assert.ok(!ua.isOld(req, 'firefox', 36));
  });

  it('should detect bot for BingPreview', t => {
    t.assert.ok(ua.isBot(r('bing')));
    t.assert.ok(!ua.isBot(r('mac-chrome-41')));
  });

  it('should detect android', t => {
    t.assert.ok(ua.isAndroid(r('android-firefox')));
    t.assert.ok(ua.isAndroid(r('android-chrome')));
    t.assert.ok(ua.isAndroid(r('android-chrome-reduced')));
  });

  it('should not detect android if other OSes', t => {
    t.assert.ok(!ua.isAndroid(r('mobile-safari-10')));
    t.assert.ok(!ua.isAndroid(r('windows-ie-11')));
  });

  it('should detect iOS', t => {
    t.assert.ok(ua.is_iOS(r('mobile-safari-10')));
    t.assert.ok(ua.is_iOS(r('standalone-ios')));
  });

  it('should not detect iOS if other OSes', t => {
    t.assert.ok(!ua.is_iOS(r('android-chrome')));
    t.assert.ok(!ua.is_iOS(r('edge-mobile')));
  });

  it('should detect Windows Phone', t => {
    t.assert.ok(ua.isWindowsPhone(r('edge-mobile')));
  });

  it('should not detect Windows Phone if other OSes', t => {
    t.assert.ok(!ua.isWindowsPhone(r('windows-edge-12')));
    t.assert.ok(!ua.isWindowsPhone(r('windows-edge-79')));
  });
});
