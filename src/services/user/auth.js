// Functionality concerning user authentification
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const usernameRegEx = /^[a-z0-9_-]{3,16}$/;
const passwordRegEx =
  /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

const register = async ({ username, password, db }) => {
  if (!username.match(usernameRegEx)) {
    throw new Error("Invalid login");
  }

  if (!password.match(passwordRegEx)) {
    throw new Error("Invalid password");
  }

  const isUsernameTaken = (await db.read({ username })) ? true : false;

  if (isUsernameTaken) {
    throw new Error("Username is already taken!");
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

const login = async ({ username, password, db }) => {
  const user = await db.read({ username });
  if (!user || password !== user.password) {
    throw new Error("Username or password is incorrect");
  }

  user.jwt = createToken(user.id);
  await db.update({ user });

  return {
    jwt: user.token,
    user: {
      username: user.username,
    },
  };
};

const authenticate = async ({ token, db }) => {
  const promise = new Promise((res) => {
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        throw err.message;
      }
      if (payload) {
        res(payload);
      } else {
        throw new Error("JWT error");
      }
    });
  });

  return promise
    .then((payload) => {
      const id = payload.id;
      if (!id) {
        throw new Error("JWT error");
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

const createToken = (id) => jwt.sign({ id: id }, process.env.JWT_KEY);

export { register, login, authenticate };
