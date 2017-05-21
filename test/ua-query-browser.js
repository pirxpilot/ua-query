var should = require('should');

global.self = {
  navigator: {
    userAgent: ''
  }
};

var ua = require('..');

var UA = {
  'linux-firefox-41': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:41.0) Gecko/20100101 Firefox/41.0',
  'windows-edge-12': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
  'windows-ie-11': 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko',
  'windows-ie-10': 'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
  'windows-ie-9': 'Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US))',
  'windows-xp-chrome-35': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.3319.102 Safari/537.36',
  'safari-7': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A',
  'mac-chrome-41': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36',
  'chromium': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/48.0.2564.116 Chrome/48.0.2564.116 Safari/537.36',
  'chrome ios': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.79 Mobile/14D27 Safari/602.1',
  'bing': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534+ (KHTML, like Gecko) BingPreview/1.0b'
};

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
