/*global require, module*/
'use strict';

var $          = require('cheerio'),
    definition = require('./definition'),
    req        = require('../utils/req'),
    URI        = require('URIjs');

/**
 * Parses the WWW-Authenticate header of the Service Provider response.
 *
 * @param {string} challenge is the value of the WWW-Authenticate header.
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

var uriWithPath = function(baseUrl, path) {
  return URI(baseUrl).path(path).toString();
};

var getTagUrl = function(baseUrl) {
  return uriWithPath(baseUrl, definition.endpoints.tag);
};

var getTagsUrl = function(baseUrl) {
  return uriWithPath(baseUrl, definition.endpoints.getTags);
};

/** @namespace */

var RadioTAG = {

  /**
   * Posts a tag to the RadioTAG service.
   *
   * @param {string|URI} baseUrl The base URL of the RadioTAG service.
   * @param {string} bearer Bearer URI for the radio station being tagged.
   * @param {string} timeSource The system clock's source of time
   *   (either 'broadcast', 'user' or 'ntp').
   * @param {Date} time The time of the tag.
   * @param {string} accessToken The CPA access token which authenticates
   *   the request.
   * @param done
   */

  tag: function(baseUrl, bearer, timeSource, time, accessToken, done) {
    var data = {
      bearer: bearer,
      time:   Math.floor(time.getTime() / 1000)
    };

    if (timeSource) {
      // jshint -W106
      data.time_source = timeSource;
      // jshint +W106
    }

    var tagUrl = getTagUrl(baseUrl);

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
   * access token.
   *
   * @param {string|URI} baseUrl The base URL of the RadioTAG service.
   * @param {string} accessToken The CPA access token which authenticates
   *   the request.
   * @param done
   */

  getTags: function(baseUrl, accessToken, done) {
    var tagsUrl = getTagsUrl(baseUrl);

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
   * the available authentication modes.
   *
   * @param {string|URI} baseUrl The base URL of the RadioTAG service.
   * @param done
   */

  getAuthProvider: function(baseUrl, done) {
    var callback = function(response) {
      var challenge = response.headers['www-authenticate'];

      if (!challenge) {
        done(new Error(definition.errorMessages.headerNotFound));
        return;
      }

      var authProvider = parseWwwAuthenticate(challenge);
      done(null, authProvider.apBaseUrl, authProvider.modes);
    };

    var tagUrl = getTagUrl(baseUrl);

    return req.postForm(tagUrl)
      .then(callback, callback);
  }
};

module.exports = RadioTAG;
