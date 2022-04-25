import express from "express";
import MongoDB from "./db/mongo/mongoDB.js";
import { authenticate, login, register } from "./services/user/auth.js";
import {
  createCard,
  deleteCard,
  getCards,
  updateCard,
} from "./services/card/cards.js";

const app = express();
const port = 3000;

const db = new MongoDB("mongodb://localhost:27017");
await db.init();

await register({ username: "user_name1", password: "Parimatch12345!", db });

const res = await login({
  username: "user_name1",
  password: "Parimatch12345!",
  db,
});
const token = res.jwt;
console.dir({ token: token });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
