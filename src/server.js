import express from "express";
import MongoDB from "./db/mongo/mongoDB.js";
import { authenticate, login, register } from "./services/user/auth.js";
import {
  createCard,
  deleteCard,
  getCard,
  getCards,
  updateCard,
} from "./services/card/cards.js";
import { verifyToken } from "./utils/token.js";

const app = express();
app.use(express.json());
const port = 3000;

const db = new MongoDB("mongodb://localhost:27017");
await db.init();

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

// CARDS API

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
