/*global define*/
define(['jquery', './definition', 'request'], function($, definition, req) {
  'use strict';

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
    var author = doc.find('author').find('name')[0].textContent;
    var entries = doc.find('feed').find('entry');

    for (var i = 0; i < entries.length; i++) {
      var tag = {
        author: author,
        title: $(entries[i]).find('title')[0].textContent,
        summary: $(entries[i]).find('summary')[0].textContent,
        publishedDate: $(entries[i]).find('published')[0].textContent
      };

      tags.push(tag);
    }

    return tags;
  };

  return {

    /**
     * Trig a tag on the RadioTAG service.
     *
     * @param stationId RadioDNS broadcast parameters joined with dots of the station the client wants to tag.
     * @param domain The domain of the RadioTAG service
     * @param accessToken The CPA access token which authenticates the request
     * @param done
     */
    tag: function(stationId, domain, accessToken, done) {
      var body = 'station=' + stationId + '&time=' + Math.floor(new Date().getTime() / 1000);

      var requestToken = (!accessToken) ? null : accessToken;
      req.postForm(domain + definition.spTagUrl, body, requestToken)
        .success(function(xmlData) {
          var tag = extractTags(xmlData)[0];

          done(null, tag);
        })
        .fail(function(err) {
          done(err);
        });
    },

    /**
     * Retrieve the list of tags for the device or the user represented by the access token
     *
     * @param domain The domain of the RadioTAG service
     * @param accessToken The CPA access token which authenticates the request
     * @param done
     */
    listTags: function(domain, accessToken, done) {
      req.get(domain + definition.spListTagsUrl, accessToken)
        .success(function(xmlData) {
          var tags = extractTags(xmlData);
          done(null, tags);
        })
        .fail(function(err) {
          done(err);
        });
    }
  };
});
