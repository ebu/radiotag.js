/*global module*/

/**
 * Define the RadioTAG service endpoints
 */

module.exports = {
  errorMessages: {
    headerNotFound: 'Missing WWW-Authenticate header.  \
                    Please, make sure CORS headers are correctly sent. \
                    ("Access-Control-Expose-Headers: WWW-Authenticate")'
  },

  endpoints: {
    tag: '/radiodns/tag/1/tag',
    getTags: '/radiodns/tag/1/tags'
  }
};
