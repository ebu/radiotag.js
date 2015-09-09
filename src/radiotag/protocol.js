/*global require, module*/
'use strict';

var $          = require('cheerio'),
    definition = require('./definition'),
    req        = require('../utils/req'),
    URI        = require('URIjs');

/**
 * @typedef ModeInfo
 * @type Object
 * @property {boolean} client Indicates whether client mode is available.
 * @property {boolean} user Indicates whether user mode is available.
 * @property {boolean} anonymous Indicates whether anonymous mode is
 *   available.
 */

/**
 * @typedef AuthProviderInfo
 * @type Object
 * @property {string} baseUrl The base URL of the authorization provider.
 * @property {ModeInfo} modes An object containing information on which
 *   authentication modes are available.
 */

/**
 * Parses the WWW-Authenticate header of the Service Provider response.
 *
 * @param {string} challenge The value of the WWW-Authenticate header.
 * @returns {AuthProviderInfo} An object containing the Authorization Provider
 *   URI and the available authentication modes.
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
    client:    (modesArray.indexOf('client') !== -1),
    user:      (modesArray.indexOf('user') !== -1),
    anonymous: false
  };

  return {
    baseUrl: data.uri,
    modes: modes
  };
};

/**
 * @typedef TagInfo
 * @type Object
 * @property {string} author The name of the service provider.
 * @property {string} title The title of the tag.
 * @property {string} summary The summary description of the tag.
 * @property {Date} published The time of the tag.
 */

/**
 * Extracts the tags from the XML document.
 *
 * @param {document} xmlData the source document.
 * @returns {Array.<TagInfo>} An array of tag information.
 *
 * @private
 */

var extractTags = function(xmlData) {
  var tags = [];
  var doc = $(xmlData);
  var author = doc.find('author name').first().text();
  var entries = doc.find('entry');

  for (var i = 0; i < entries.length; i++) {
    var date = $(entries[i]).find('published').first().text();

    var tag = {
      author: author,
      title: $(entries[i]).find('title').first().text(),
      summary: $(entries[i]).find('summary').first().text(),
      published: new Date(date)
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
   * Callback function for the {@link RadioTAG.tag} function.
   *
   * @callback tagCallback
   * @param {Error|null} error On success, this value is <code>null</code>;
   *   on error, it is an <code>Error</code> object containing an error message.
   * @param {TagInfo|null} data On success, this value is an object containing
   *   the information about the tag; on error, this value is <code>null</code>.
   */

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
   * @param {tagCallback} done Callback function.
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
   * Callback function for the {@link RadioTAG.getTags} function.
   *
   * @callback getTagsCallback
   * @param {Error|null} error On success, this value is <code>null</code>;
   *   on error, it is an <code>Error</code> object containing an error message.
   * @param {Array.<TagInfo>|null} data On success, this value is an array of
   *   objects, each containing tag information; on error, this value is
   *   <code>null</code>.
   */

  /**
   * Retrieves the list of tags for the device or the user represented by the
   * access token.
   *
   * @param {string|URI} baseUrl The base URL of the RadioTAG service.
   * @param {string} accessToken The CPA access token which authenticates
   *   the request.
   * @param {getTagsCallback} done Callback function.
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
   * Callback function for the {@link RadioTAG.getAuthProvider}
   * function.
   *
   * @callback getAuthProviderCallback
   * @param {Error|null} error On success, this value is <code>null</code>;
   *   on error, it is an <code>Error</code> object containing an error message.
   * @param {string|null} baseUrl On success, this value the base URL of the
   *   authorization provider associated with this service provider.
   * @param {ModeInfo|null} modes On success, an object indicating which
   *   authentication modes are available.
   */

  /**
   * Discovers the CPA Auth Provider associated with the RadioTAG service, and
   * the available authentication modes.
   *
   * @param {string|URI} baseUrl The base URL of the RadioTAG service.
   * @param {getAuthProviderCallback} done Callback function.
   */

  getAuthProvider: function(baseUrl, done) {
    var callback = function(response) {
      var challenge = response.headers['www-authenticate'];

      if (!challenge) {
        done(new Error(definition.errorMessages.headerNotFound));
        return;
      }

      var authProvider = parseWwwAuthenticate(challenge);
      done(null, authProvider.baseUrl, authProvider.modes);
    };

    var tagUrl = getTagUrl(baseUrl);

    return req.postForm(tagUrl)
      .then(callback, callback);
  }
};

module.exports = RadioTAG;
