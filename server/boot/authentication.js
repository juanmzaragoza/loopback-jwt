'use strict';

const config = require('../config.json');
const logger = require('../../common/lib/logger');

module.exports = function enableAuthentication(server) {
  // enable authentication
  if(config.jwt.secured){
  	logger.info("Aplication secured with JWT")
  	server.enableAuth();
  }
  
};
