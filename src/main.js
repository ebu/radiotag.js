/*global require*/
require.config({
  baseUrl: 'src',
  paths: {
    'jquery':      'lib/jquery/dist/jquery.min',
    'require':     'lib/require.js/build/require.min',
    'request':     'utils/req',
    'URIjs':       'lib/URIjs/src'
  }
});

require(['radiotag']);
