module.exports = function createErrorLogger(options) {
  return function logError(err, req, res, next) {
    // your custom error-logging logic goes here
    console.log("Server error: ",err);

    const status = err.status || err.statusCode;
    if (status >= 500) {
      // log only Internal Server errors
      console.log('Unhandled error for request %s %s: %s',
        req.method, req.url, err.stack || err);
    }

    // handle errors responses
    switch(err.code){
      case "AUTHORIZATION_REQUIRED":
        err.statusCode = 401;
        err.message = "Autenticación requerida";
        break;
      /*default:
        err.name = "Error";
        err.message = "Error desconocido";*/
    }

    if (req.app.get('env') !== 'development') {
        delete err.stack;
        delete err.code;
    }

    // Let the next error handler middleware
    // produce the HTTP response
    next(err);
  };
}