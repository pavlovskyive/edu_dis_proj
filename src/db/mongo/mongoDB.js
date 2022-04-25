import { MongoClient } from "mongodb";

export default class MongoDB {
  #url;
  #users;

  constructor(url) {
    this.#url = url;
  }

  async init() {
    console.log("Initializing MongoDB...");

    const mongoClient = new MongoClient(this.#url);

    try {
      await mongoClient.connect();
      const db = mongoClient.db("usersdb");
      this.#users = db.collection("users");
      console.log("Initializing MongoDB: Successfull!");
    } catch (err) {
      console.log(err);
    }
  }

  async create({ user }) {
    await this.#users.insertOne(user);
  }

  async read({ id, username }) {
    if (id) {
      return await this.#users.findOne({ id: id });
    } else {
      return await this.#users.findOne({ username: username });
    }
  }

  async update({ user }) {
    const result = await this.#users.updateOne(
      { id: user.id },
      { $set: { ...user } }
    );
    return result;
  }
}
