/*global define*/
define('radiotag', ['./radiotag/protocol', './radiotag/utils'], function(protocol, utils) {
  'use strict';

  protocol.utils = utils;
  return protocol;
});
