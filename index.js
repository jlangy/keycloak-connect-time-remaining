// For any request refresh the grant
  // if needed. If the access token is expired (defaults to 5min in keycloak),
  // the refresh token will be used to get a new access token, and the refresh token expiry will be updated.
async function checkIdleTimeRemaining(req, res, next, ignoredRoutes=[], keycloak){
  if(Array.isArray(ignoredRoutes)){
    for (let route of ignoredRoutes){
      if (req.path === route) return next();
    }
  } 
  if (req.kauth && req.kauth.grant) {
    try {
      const grant = await keycloak.getGrant(req, res);
      await keycloak.grantManager.ensureFreshness(grant);
    } catch (error) {
      return next(error);
    }
  }

  next();
}

module.exports = checkIdleTimeRemaining;