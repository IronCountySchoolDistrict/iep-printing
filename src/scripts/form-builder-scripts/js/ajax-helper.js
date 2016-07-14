require.config({
  paths: {
    URI: 'https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.18.0/URI',
    punycode: 'https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.18.0/punycode',
    IPv6: 'https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.18.0/IPv6',
    SecondLevelDomains: 'https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.18.0/SecondLevelDomains'
  }
});

require(['URI'], URI => {
  /**
   * determine if responseid should be inserted into AJAX request
   * @param  {object} openParams   URI.js object for uri that XHR.open was about to open
   * @param  {object} windowParams URI.js object for uri of the current page (uses content frame if opened in frame)
   * @return {boolean}          returns true if responseId should be added to url, false if it shouldn't be inserted
   */
  function shouldInsertResponseId(openParams, windowParams) {
    return (
      typeof openParams.action !== 'undefined' &&
      typeof windowParams.responseid !== 'undefined' &&
      openParams.action === 'getChoices' &&
      windowParams.responseid > 0
    );
  }
  (function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
      var openUri = new URI(url);
      var windowUri = new URI(window.location);
      var openParams = openUri.search(true);
      var windowParams = windowUri.search(true);
      if (shouldInsertResponseId(openParams, windowParams)) {
        openUri.setSearch('responseid', windowParams.responseid);
      }
      open.call(this, method, openUri.toString(), async, user, pass);
    };
  }(XMLHttpRequest.prototype.open));
});
