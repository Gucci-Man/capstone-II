const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { ExpressError }= require("../expressError");

/** Middleware: Auth JWT token, add auth'd user (if any) to req. */
function authenticateJWT(req, res , next) {
    try {  
        // Look for token in header
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return next(); // Token not found, but don't throw an error
        }
        const token = authHeader.split(' ')[1]; // Extract token after "Bearer "

        // payload should have included username property
        const payload = jwt.verify(token, SECRET_KEY);
        /* console.log(`INSIDE authenticateJWT, payload is ${JSON.stringify(payload)}`); */
        // add payload on to req itself. If req.user exist, then token is verified.
        req.user = payload;
        return next();
    } catch (e) {
        // Error in this middleware isn't error -- continue on
        return next();
    }
};

/** Middleware: Require user is authenticated */
function ensureLoggedIn(req, res, next) {
    if (!req.user) {
        const e = new ExpressError("Unauthorized", 401);
        return next(e)
    } else {
        return next();
    }
}

/** Middleware: Requires correct username. */
function ensureCorrectUser(req, res, next) {
    try {
        // username from req.user should match with req.params
        /* console.log(`req.user is ${JSON.stringify(req.user, null, 2)}`); */
        if (req.user.username === req.params.username) {
            return next();
        } else {
            return next({ status: 401, message: "Unauthorized" });
        }
    } catch (err) {
        // Errors would happen here if we made a request and req.user is undefined
        return next({ status: 401, message: "Unauthorized" });
    }
}
// end

module.exports = { 
    authenticateJWT, 
    ensureLoggedIn, 
    ensureCorrectUser 
};