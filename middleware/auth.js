const jwt = require("jsonwebtoken");

exports.isAuthenticated = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "SECRET", function(err, decoded) {
      if(decoded) {
        return next();
      } else {
        return next({ status: 401, message: "Bad authentication token." });
      }
    });
  }
  catch(err) {
    return next({ status: 401, message: "You must be logged in." });
  }
};

exports.isAuthorized = function(req, res, next) {
  try {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, "SECRET", function(err, decoded) {
    if(decoded && decoded.id === req.params.id) {
      return next();
    } else {
        return next({ status: 401, message: "You are not authorized to do that." });
    }
    });
  }
  catch (err) {
    return next({ status: 401, message: "You must be logged in." });
  }
};