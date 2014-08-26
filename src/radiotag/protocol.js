/*global require, module*/
'use strict';

var $          = require('cheerio'),
    definition = require('./definition'),
    req        = require('../utils/req');

/**
 * [PRIVATE] This method parses the WWW-Authenticate header of the
 * Service Provider response.
 *
 * @param challenge is the value of the WWW-Authenticate header.
 * @returns An object containing the Authorization Provider URI and the available
 * modes
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
 * [PRIVATE] Extract the tags from the xml document.
 *
 * @param xmlData represent the source document
 * @returns an array of tags containing the following fields:
 * author, title, summary, publishedDate
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

module.exports = {

  /**
   * Trig a tag on the RadioTAG service.
   *
   * @param stationId RadioDNS broadcast parameters joined with dots of the station the client wants to tag.
   * @param uri The URI of the RadioTAG service
   * @param accessToken The CPA access token which authenticates the request
   * @param done
   */
  tag: function(stationId, uri, accessToken, done) {
    var body = 'station=' + stationId + '&time=' + Math.floor(new Date().getTime() / 1000);

    var requestToken = (!accessToken) ? null : accessToken;
    req.postForm(uri + definition.endpoints.spTagUrl, body, requestToken)
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
   * Retrieve the list of tags for the device or the user represented by the access token
   *
   * @param uri The URI of the RadioTAG service
   * @param accessToken The CPA access token which authenticates the request
   * @param done
   */
  listTags: function(uri, accessToken, done) {
    req.get(uri + definition.endpoints.spListTagsUrl, accessToken)
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
   *  Discover the responsible AP and the available modes for a domain
   *  Application Specific
   *
   *  @param uri The URI of the RadioTAG service
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

    return req.postForm(uri + definition.endpoints.spTagUrl)
      .then(
        function(response) {
          callback(response);
        },
        function(response) {
          callback(response);
        }
      );
  }
};
