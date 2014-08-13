/*global require, module*/
'use strict';

var request = require('request'),
    Promise = require('es6-promise').Promise;

/*
  Accepts a jQuery.ajax-compatible hash 
  of parameters and performs an HTTP-request
*/
module.exports = function (params) {
  return new Promise(function (resolve, reject) {
    
    params.method = params.type;
    delete params.type;

    params.headers['Content-Type'] = params.contentType;
    params.body = params.data;
    
    request(params, function (error, req, responseBody) {
      // jQuery API
      req.getResponseHeader = req.getHeader;

      // body, textStatus, jqXHR
      if (error) {
        reject(error);
      } else {
        resolve(responseBody, req.statusCode, req);
      }
    });
  });
};
