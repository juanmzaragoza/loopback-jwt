'use strict';
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const secretKey = config.jwt.secret || null;

module.exports = function(app) {
  const User = app.models.User;
  const AccessToken = app.models.AccessToken;

  User.prototype.createAccessToken = function(ttl, cb) {
    const expiresIn = ttl || config.jwt.token_expiration * 60;
console.log(expiresIn)
    // generate jwt
    const accessToken = jwt.sign({id: this.id, username: this.username, email: this.email,}, secretKey, {expiresIn});

    return cb ? cb(null, Object.assign(this, {token: accessToken})) : {token: accessToken};
  };

  User.logout = function(tokenId, fn) {
    // We may want to implement JWT black list here
    fn();
  };

  AccessToken.resolve = function(token, cb) {
    if (token) {
      try {
        const data = jwt.verify(token, secretKey);
        cb(null, {userId: data.id});
      } catch (err) {
        // We should override the error to 401
        cb({
          "statusCode": 401,
          "name": "UnauthorizedError",
          "message": "Token inválido",
          "stack": err.stack
        });
      }
    } else {
      cb();
    }
  };
};