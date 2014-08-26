/*global module*/

/**
 *  Define the RadioTAG service endpoints
 */
module.exports = {
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