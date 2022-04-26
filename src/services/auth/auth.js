// Functionality concerning user authentification
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

import { createToken } from "../../utils/token.js";
import { usernameRegEx, passwordRegEx } from "./auth.constants.js";

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} password
 * @property {string} id
 */

/**
 * Register's user in system (creating correcponding doc in database).
 * @param {Object} param
 * @param {User} param.user user
 * @param {Object} param.db database
 * @return {Object} new user's info
 */

const register = async ({ user: { username, password }, db }) => {
  if (!username.match(usernameRegEx)) {
    throw new Error("Invalid login");
  }

  if (!password.match(passwordRegEx)) {
    throw new Error("Invalid password");
  }

  const isUsernameTaken = (await db.read({ username })) ? true : false;

  if (isUsernameTaken) {
    throw new Error("Username is already taken");
  }

  const id = randomUUID();
  const user = {
    id: id,
    username,
    password,
    cards: [],
    token: createToken(id),
  };

  await db.create({ user: user });

  return {
    jwt: user.token,
    user: {
      username: user.username,
    },
  };
};

/**
 * Logs in user.
 * @param {Object} param
 * @param {User} param.user user
 * @param {Object} param.db database
 * @return {Object} user's updated info
 */
const login = async ({ user: { username, password }, db }) => {
  const user = await db.read({ username });
  if (!user || password !== user.password) {
    throw new Error("Bad credentials");
  }

  user.token = createToken(user.id);
  await db.update({ user });

  return {
    jwt: user.token,
    user: {
      username: user.username,
    },
  };
};

/**
 * Authenticates user
 * @param {Object} param
 * @param {string} param.token token
 * @param {Object} param.db database
 * @return {User} user
 */
const authenticate = async ({ token, db }) => {
  const promise = new Promise((res) => {
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        throw err.message;
      }
      if (payload) {
        res(payload);
      } else {
        throw new Error("Faulty JWT");
      }
    });
  });

  return promise
    .then((payload) => {
      const id = payload.id;
      if (!id) {
        throw new Error("Faulty JWT");
      }
      return id;
    })
    .then((id) => {
      return db.read({ id });
    })
    .then((user) => {
      if (user && user.token == token) {
        return user;
      } else {
        throw new Error("Authentication failed");
      }
    })
    .catch((err) => {
      throw err;
    });
};

export { register, login, authenticate };
