import express from "express";
import MongoDB from "./db/mongo/mongoDB.js";
import { authenticate, login, register } from "./services/auth/auth.js";
import {
  createCard,
  deleteCard,
  getCard,
  getCards,
  updateCard,
} from "./services/cards/cards.js";
import { verifyToken } from "./utils/token.js";
import errors from "./constants/errors.js";

// Database initialization
const db = new MongoDB(process.env.MONGODB_URL);
await db.init();

// Server initialization
const app = express();
app.use(express.json());

// Routing

// Auth API

app.post("/auth/local/register", async (req, res, next) => {
  return register({ user: req.body, db })
    .then((userInfo) => {
      res.send(userInfo);
    })
    .catch((e) => next(e));
});

app.post("/auth/local", async (req, res, next) => {
  return login({ user: req.body, db })
    .then((userInfo) => {
      res.send(userInfo);
    })
    .catch((e) => next(e));
});

// Cards API

app.get("/cards", verifyToken, async (req, res, next) => {
  return authenticate({ token: req.token, db })
    .then((user) => {
      res.send(getCards({ user }));
    })
    .catch((e) => next(e));
});

app.get("/cards/:id", verifyToken, async (req, res, next) => {
  return authenticate({ token: req.token, db })
    .then((user) => {
      res.send(getCard({ user, cardId: req.params.id }));
    })
    .catch((e) => next(e));
});

app.post("/cards", verifyToken, async (req, res, next) => {
  return authenticate({ token: req.token, db })
    .then((user) => {
      return createCard({ user, card: req.body, db });
    })
    .then((card) => {
      res.send(card);
    })
    .catch((e) => next(e));
});

app.put("/cards/:id", verifyToken, async (req, res, next) => {
  return authenticate({ token: req.token, db })
    .then((user) => {
      const card = req.body;
      card.id = req.params.id;
      return updateCard({ user, card, db });
    })
    .then((card) => {
      res.send(card);
    })
    .catch((e) => next(e));
});

app.delete("/cards/:id", verifyToken, async (req, res, next) => {
  return authenticate({ token: req.token, db })
    .then((user) => {
      return deleteCard({ user, cardId: req.params.id, db });
    })
    .then(() => res.send())
    .catch((e) => next(e));
});

// Server configuration

const port = process.env.PORT || 3000;

app.use((err, req, res, next) => {
  const errorMessage = err.message;
  const knownErrorStatus = errors[errorMessage];
  if (knownErrorStatus) {
    res.status(knownErrorStatus).send(errorMessage);
  } else {
    res.status(500).send(`Unknown error: ${errorMessage}`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
