/*global require, module*/
'use strict';

var protocol = require('./radiotag/protocol'),
    utils    = require('./radiotag/utils');

protocol.utils = utils;

module.exports = protocol;
