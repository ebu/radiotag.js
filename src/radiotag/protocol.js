/*global require, module*/
'use strict';

var $          = require('cheerio'),
    definition = require('./definition'),
    req        = require('../utils/req'),
    URI        = require('URIjs');

/**
 * Parses the WWW-Authenticate header of the Service Provider response.
 *
 * @param challenge is the value of the WWW-Authenticate header.
 * @returns An object containing the Authorization Provider URI and the
 * available modes.
 *
 * @private
 */

var parseWwwAuthenticate = function(challenge) {
  var regex = /(?:(\w*)\=\"(.*?))*\"/g;
  var match = [], data = {};
  while ((match = regex.exec(challenge)) !== null) {
    data[match[1]] = match[2];
  }

  var modesArray = data.modes.split(',');
  var modes = {
    client:  (modesArray.indexOf('client') !== -1),
    user:    (modesArray.indexOf('user') !== -1),
    anonymous: false
  };

  return {
    apBaseUrl: data.uri+'/',
    modes: modes
  };
};

/**
 * Extracts the tags from the XML document.
 *
 * @param xmlData the source document.
 * @returns an array of tags containing the following fields:
 * author, title, summary, publishedDate.
 *
 * @private
 */

var extractTags = function(xmlData) {
  var tags = [];
  var doc = $(xmlData);
  var author = doc.find('author name').first().text();
  var entries = doc.find('entry');

  for (var i = 0; i < entries.length; i++) {
    var tag = {
      author: author,
      title: $(entries[i]).find('title').first().text(),
      summary: $(entries[i]).find('summary').first().text(),
      publishedDate: $(entries[i]).find('published').first().text()
    };

    tags.push(tag);
  }

  return tags;
};

var uriWithPath = function(uri, path) {
  return URI(uri).path(path).toString();
};

var getTagUrl = function(uri) {
  return uriWithPath(uri, definition.endpoints.spTagUrl);
};

var getTagsUrl = function(uri) {
  return uriWithPath(uri, definition.endpoints.spListTagsUrl);
};

module.exports = {

  /**
   * Posts a tag to the RadioTAG service.
   *
   * @param bearer Bearer URI for the radio service being tagged
   * @param timeSource The system clock's source of time (either 'broadcast',
   * 'user' or 'ntp')
   * @param uri The URI of the RadioTAG service
   * @param accessToken The CPA access token which authenticates the request
   * @param done
   */

  tag: function(bearer, timeSource, uri, accessToken, done) {
    var data = {
      bearer: bearer,
      time:   Math.floor(new Date().getTime() / 1000)
    };

    if (timeSource) {
      // jshint -W106
      data.time_source = timeSource;
      // jshint +W106
    }

    var tagUrl = getTagUrl(uri);

    req.postForm(tagUrl, data, accessToken)
      .then(
        function(response) {
          var tag = extractTags(response.body)[0];

          done(null, tag);
        },
        function(response) {
          done(response);
        }
      );
  },

  /**
   * Retrieves the list of tags for the device or the user represented by the
   * access token
   *
   * @param uri The URI of the RadioTAG service
   * @param accessToken The CPA access token which authenticates the request
   * @param done
   */

  listTags: function(uri, accessToken, done) {
    var tagsUrl = getTagsUrl(uri);

    req.get(tagsUrl, accessToken)
      .then(
        function(response) {
          var tags = extractTags(response.body);
          done(null, tags);
        },
        function(response) {
          done(response);
        }
      );
  },

  /**
   * Discovers the CPA Auth Provider associated with the RadioTAG service, and
   * the available authentication modes
   *
   * @param uri The URI of the RadioTAG service
   * @param done
   */

  getAuthProvider: function(uri, done) {
    var callback = function(response) {
      var challenge = response.headers['www-authenticate'];

      if (!challenge) {
        done(new Error(definition.errorMessages.headerNotFound));
        return;
      }

      var authProvider = parseWwwAuthenticate(challenge);
      done(null, authProvider.apBaseUrl, authProvider.modes);
    };

    var tagUrl = getTagUrl(uri);

    return req.postForm(tagUrl)
      .then(callback, callback);
  }
};
