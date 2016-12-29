var should = require('should');
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
  'bing': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534+ (KHTML, like Gecko) BingPreview/1.0b'
};

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
      ua.isChrome(r('safari-7'))
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
  });

  it('should not detect Chrome if requested version is above what we have', function() {
    should(
      ua.isChrome(r(
        'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.3319.102 Safari/537.36'
      ), 36)
    ).not.be.ok();
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

});
