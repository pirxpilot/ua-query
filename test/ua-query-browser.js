const { describe, it } = require('node:test');

global.self = {
  navigator: {
    userAgent: ''
  }
};

const ua = require('..');
const UA = require('./ua-strings.js');

function set(ua) {
  delete global.self.navigator._ua_cache;
  global.self.navigator.userAgent = UA[ua] || ua;
}

describe('ua query browser', () => {
  it('should not detect Windows XP if user-agent is missing', t => {
    set('');
    t.assert.ok(!ua.isWindowsXP());
  });

  it('should not detect Windows XP on Linux or MAC', t => {
    set('linux-firefox-41');
    t.assert.ok(!ua.isWindowsXP());

    set('safari-7');
    t.assert.ok(!ua.isWindowsXP());
  });

  it('should detect Windows XP on Windows XP', t => {
    set('windows-xp-chrome-35');
    t.assert.ok(ua.isWindowsXP());
  });

  it('should not detect Chrome if user-agent is missing', t => {
    set();
    t.assert.ok(!ua.isChrome());
  });

  it('should not detect Chrome if other browsers', t => {
    set('linux-firefox-41');
    t.assert.ok(!ua.isChrome());

    set('windows-edge-12');
    t.assert.ok(!ua.isChrome());

    set('windows-edge-79');
    t.assert.ok(!ua.isChrome());

    set('safari-7');
    t.assert.ok(!ua.isChrome());

    set('chrome ios');
    t.assert.ok(!ua.isChrome());
  });

  it('should detect Chrome', t => {
    set('windows-xp-chrome-35');
    t.assert.ok(ua.isChrome());
    set('chromium');
    t.assert.ok(ua.isChrome());
  });

  it('ua should detect Chrome iOS', t => {
    set('chrome ios');
    t.assert.ok(ua.isChrome_iOS());
  });

  it('should detect Firefox', t => {
    set('linux-firefox-41');
    t.assert.ok(ua.isFirefox());
  });

  it('should detect Safari', t => {
    set('safari-7');

    t.assert.ok(ua.isSafari());
    t.assert.ok(ua.isSafari(6));
    t.assert.ok(ua.isSafari(7));
    t.assert.ok(ua.isOld('safari', 8));

    set('mobile-safari-10');
    t.assert.ok(ua.isSafari(10));
  });

  it('should not detect Safari if other browsers', t => {
    set('mac-chrome-41');
    t.assert.ok(!ua.isSafari());
    set('windows-xp-chrome-35');
    t.assert.ok(!ua.isSafari());
    set('linux-firefox-41');
    t.assert.ok(!ua.isSafari());
    set('windows-edge-12');
    t.assert.ok(!ua.isSafari());
    set('windows-edge-79');
    t.assert.ok(!ua.isSafari());
    set('standalone-ios');
    t.assert.ok(!ua.isSafari());
  });

  it('should not detect Firefox if Chrome', t => {
    set('windows-xp-chrome-35');
    t.assert.ok(!ua.isFirefox());
  });

  it('should detect Chrome if requested version is the same', t => {
    set('windows-xp-chrome-35');
    t.assert.ok(ua.isChrome(35));
    set('chromium');
    t.assert.ok(ua.isChrome(38));
  });

  it('should not detect Chrome if requested version is above what we have', t => {
    set('Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.3319.102 Safari/537.36');
    t.assert.ok(!ua.isChrome(36));
  });

  it('should detect IE <= 10', t => {
    set('windows-ie-9');
    t.assert.ok(ua.isIE());
    set('windows-ie-10');
    t.assert.ok(ua.isIE(10));
    t.assert.ok(!ua.isIE(11));
  });

  it('should detect IE 11', t => {
    set('windows-ie-11');
    t.assert.ok(ua.isIE());
    t.assert.ok(ua.isIE(10));
    t.assert.ok(ua.isIE(11));
  });

  it('should detect Edge', t => {
    set('windows-edge-12');
    t.assert.ok(ua.isEdge());
    t.assert.ok(ua.isEdge(12));
    set('windows-edge-79');
    t.assert.ok(ua.isEdge());
    t.assert.ok(ua.isEdge(79));
    set('windows-ie-11');
    t.assert.ok(!ua.isEdge());
  });

  it('should detect standalone iOS', t => {
    set('standalone-ios');
    t.assert.ok(ua.isStandalone_iOS(10));

    t.assert.ok(!ua.isStandalone_iOS(11));

    set('standalone-ios-10.1');
    t.assert.ok(ua.isStandalone_iOS(10));

    set('mobile-safari-10');
    t.assert.ok(!ua.isStandalone_iOS());

    set('chrome ios');
    t.assert.ok(!ua.isStandalone_iOS());
  });

  it('should check for old browser version', t => {
    set('windows-xp-chrome-35');

    t.assert.ok(ua.isOld('chrome', 36));
    t.assert.ok(!ua.isOld('chrome', 35));
    t.assert.ok(!ua.isOld('chrome', 34));

    t.assert.ok(!ua.isOld('safari', 36));
    t.assert.ok(!ua.isOld('ie', 36));
    t.assert.ok(!ua.isOld('firefox', 36));
  });
});
