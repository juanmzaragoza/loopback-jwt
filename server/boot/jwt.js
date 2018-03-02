'use strict';
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY || null;

module.exports = function(app) {
  const User = app.models.User;
  const AccessToken = app.models.AccessToken;

  User.prototype.createAccessToken = function(ttl, cb) {
    const userSettings = this.constructor.settings;
    const expiresIn = Math.min(ttl || userSettings.ttl, userSettings.maxTTL);

    // generate jwt
    const accessToken = jwt.sign({id: this.id, username: this.username, email: this.email,}, secretKey, {expiresIn});

    return cb ? cb(null, Object.assign(this, {accessToken})) : {token: accessToken};
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