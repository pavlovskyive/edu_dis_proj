import { MongoClient } from "mongodb";

/**
 * Database provider
 */
export default class MongoDB {
  #url;
  #users;

  /**
   * @param {string} url
   */
  constructor(url) {
    this.#url = url;
  }

  /**
   * Need to be called in order to initialize MongoDB instance
   */
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

  /**
   * Creating a doc for user in database
   * @param {User} user
   */
  async create({ user }) {
    await this.#users.insertOne(user);
  }

  /**
   * Get user from database. Either 'id' or 'username' is necessary
   * @param {string} id
   * @param {string} username
   * @return {User} user
   */
  async read({ id, username }) {
    if (id) {
      return await this.#users.findOne({ id: id });
    } else {
      return await this.#users.findOne({ username: username });
    }
  }

  /**
   * Update user's document in database
   * @param {User} user
   * @return {User} updated user's info
   */
  async update({ user }) {
    const result = await this.#users.updateOne(
      { id: user.id },
      { $set: { ...user } }
    );
    return result;
  }
}
