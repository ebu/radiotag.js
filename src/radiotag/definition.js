/*global define*/
define([], function() {
  'use strict';

  /**
   *  Define the RadioTAG service endpoints
   */
  return {
    errorMessages: {
      headerNotFound: 'Missing WWW-Authenticate header.  \
                      Please, make sure CORS headers are correctly sent. \
                      ("Access-Control-Expose-Headers: WWW-Authenticate")'
    },

    endpoints: {
      spTagUrl: 'tag',
      spListTagsUrl: 'tags'
    }
  };
});
