import jwt from "jsonwebtoken";

/**
 * Verifies token and assigns it to req.token
 * @param {Object} req request
 * @param {Object} res response
 * @param {CallableFunction} next next middleware
 */
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    req.token = bearerToken;

    next();
  } else {
    res.sendStatus(403);
  }
}

/**
 * Creates JWT token with user's id payload
 * @param {string} id user's id
 * @return {string} JWT token
 */
const createToken = (id) => jwt.sign({ id: id }, process.env.JWT_KEY);

export { verifyToken, createToken };
