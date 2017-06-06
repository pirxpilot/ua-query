var should = require('should');

global.self = {
  navigator: {
    userAgent: ''
  }
};

var ua = require('..');
var UA = require('./ua-strings.js');

function set(ua) {
  delete global.self.navigator._ua_cache;
  global.self.navigator.userAgent = UA[ua] || ua;
}

describe('ua query browser', function () {
  it('should not detect Windows XP if user-agent is missing', function() {
    set('');
    should(
      ua.isWindowsXP()
    ).not.be.ok();
  });

  it('should not detect Windows XP on Linux or MAC', function() {
    set('linux-firefox-41');
    should(
      ua.isWindowsXP()
    ).not.be.ok();

    set('safari-7');
    should(
      ua.isWindowsXP()
    ).not.be.ok();
  });

  it('should detect Windows XP on Windows XP', function() {
    set('windows-xp-chrome-35');
    should(
      ua.isWindowsXP()
    ).be.ok();
  });

  it('should not detect Chrome if user-agent is missing', function() {
    set();
    should(
      ua.isChrome()
    ).not.be.ok();
  });

  it('should not detect Chrome if other browsers', function() {
    set('linux-firefox-41');
    should(
      ua.isChrome()
    ).not.be.ok();

    set('windows-edge-12');
    should(
      ua.isChrome()
    ).not.be.ok();

    set('safari-7');
    should(
      ua.isChrome()
    ).not.be.ok();

    set('chrome ios');
    should(
      ua.isChrome()
    ).not.be.ok();
  });

  it('should detect Chrome', function() {
    set('windows-xp-chrome-35');
    should(
      ua.isChrome()
    ).be.ok();
    set('chromium');
    should(
      ua.isChrome()
    ).be.ok();
  });

  it('ua should detect Chrome iOS', function() {
    set('chrome ios');
    should(
      ua.isChrome_iOS()
    ).be.ok();
  });

  it('should detect Firefox', function() {
    set('linux-firefox-41');
    should(
      ua.isFirefox()
    ).be.ok();
  });

  it('should detect Safari', function() {
    set('safari-7');

    should(
      ua.isSafari()
    ).be.ok();
    should(
      ua.isSafari(6)
    ).be.ok();
    should(
      ua.isSafari(7)
    ).be.ok();
    should(
      ua.isOld('safari', 8)
    ).be.ok();

    set('mobile-safari-10');
    should(
      ua.isSafari(10)
    ).be.ok();
  });

  it('should not detect Safari if other browsers', function() {
    set('mac-chrome-41');
    should(
      ua.isSafari()
    ).not.be.ok();
    set('windows-xp-chrome-35');
    should(
      ua.isSafari()
    ).not.be.ok();
    set('linux-firefox-41');
    should(
      ua.isSafari()
    ).not.be.ok();
    set('windows-edge-12');
    should(
      ua.isSafari()
    ).not.be.ok();
    set('standalone-ios');
    should(
      ua.isSafari()
    ).not.be.ok();
  });

  it('should not detect Firefox if Chrome', function() {
    set('windows-xp-chrome-35');
    should(
      ua.isFirefox()
    ).not.be.ok();
  });

  it('should detect Chrome if requested version is the same', function() {
    set('windows-xp-chrome-35');
    should(
      ua.isChrome(35)
    ).be.ok();
    set('chromium');
    should(
      ua.isChrome(38)
    ).be.ok();
  });

  it('should not detect Chrome if requested version is above what we have', function() {
    set(
      'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.3319.102 Safari/537.36'
    );
    should(
      ua.isChrome(36)
    ).not.be.ok();
  });

  it('should detect IE <= 10', function() {
    set('windows-ie-9');
    should(
      ua.isIE()
    ).be.ok();
    set('windows-ie-10');
    should(
      ua.isIE(10)
    ).be.ok();
    should(
      ua.isIE(11)
    ).be.not.ok();
  });

  it('should detect IE 11', function() {
    set('windows-ie-11');
    should(
      ua.isIE()
    ).be.ok();
    should(
      ua.isIE(10)
    ).be.ok();
    should(
      ua.isIE(11)
    ).be.ok();
  });

  it('should detect Edge', function() {
    set('windows-edge-12');
    should(
      ua.isEdge()
    ).be.ok();
    should(
      ua.isEdge(12)
    ).be.ok();
    set('windows-ie-11');
    should(
      ua.isEdge()
    ).be.not.ok();
  });

  it('should detect standalone iOS', function() {
    set('standalone-ios');
    should(
      ua.isStandalone_iOS(10)
    ).be.ok();

    should(
      ua.isStandalone_iOS(11)
    ).not.be.ok();

    set('standalone-ios-10.1');
    should(
      ua.isStandalone_iOS(10)
    ).be.ok();

    set('mobile-safari-10');
    should(
      ua.isStandalone_iOS()
    ).not.be.ok();

    set('chrome ios');
    should(
      ua.isStandalone_iOS()
    ).not.be.ok();
  });

  it('should check for old browser version', function() {
    set('windows-xp-chrome-35');

    should(ua.isOld('chrome', 36)).be.ok();
    should(ua.isOld('chrome', 35)).not.be.ok();
    should(ua.isOld('chrome', 34)).not.be.ok();

    should(ua.isOld('safari', 36)).not.be.ok();
    should(ua.isOld('ie', 36)).not.be.ok();
    should(ua.isOld('firefox', 36)).not.be.ok();
  });

});
