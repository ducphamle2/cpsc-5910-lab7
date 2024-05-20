// Configure Auth Validation

export class Middleware {
  validateAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      throw new Error("Auth not validated");
    }
  }
}
