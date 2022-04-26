import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

import { register, login, authenticate } from "../auth";
import { createToken } from "../../../utils/token";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const jwtTokenParts = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "eyJpZCI6IjQzNzcxMDI0LWNhNDktNDFmYS05",
  "ccPCj1DjN0nc-du6x9gjXU8qM3f-6ED614vE",
];
const jwtToken = jwtTokenParts.join(".");

jest.mock("../../../utils/token", () => ({
  createToken: jest.fn(() => jwtTokenParts.join(".")),
}));

describe("Auth service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mocked input data
  const user = {
    username: "anna_vasylashko",
    password: "048PJs52rt!",
  };
  const userId = "58vh653i-87gb-9527-6b42-h6tsm889ikc5";

  describe("register", () => {
    const db = {
      read: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    it("should register new user", async () => {
      randomUUID.mockReturnValueOnce(userId);

      const result = await register({ user, db });

      expect(db.read).toHaveBeenCalledTimes(1);
      expect(db.read).toHaveBeenCalledWith({ username: user.username });

      expect(createToken).toHaveBeenCalledTimes(1);
      expect(createToken).toHaveBeenCalledWith(userId);

      const newUser = {
        id: userId,
        username: user.username,
        password: user.password,
        cards: [],
        token: jwtToken,
      };

      expect(db.create).toHaveBeenCalledTimes(1);
      expect(db.create).toHaveBeenCalledWith({ user: newUser });

      expect(result).toEqual({
        jwt: jwtToken,
        user: {
          username: user.username,
        },
      });
    });

    describe("error cases", () => {
      it("should throw error if username is invalid", async () => {
        try {
          await register({ user: { ...user, username: "Anna" }, db });
        } catch (e) {
          expect(e).toEqual(new Error("Invalid login"));
        }

        expect(db.read).not.toHaveBeenCalled();
        expect(db.update).not.toHaveBeenCalled();
        expect(createToken).not.toHaveBeenCalled();
        expect(db.create).not.toHaveBeenCalled();
      });

      it("should throw error if password is invalid", async () => {
        try {
          await register({ user: { ...user, password: "1234" }, db });
        } catch (e) {
          expect(e).toEqual(new Error("Invalid password"));
        }

        expect(db.read).not.toHaveBeenCalled();
        expect(db.update).not.toHaveBeenCalled();
        expect(createToken).not.toHaveBeenCalled();
        expect(db.create).not.toHaveBeenCalled();
      });

      it("should throw error if username is taken", async () => {
        try {
          await register({ user, db: { ...db, read: jest.fn(() => true) } });
        } catch (e) {
          expect(e).toEqual(new Error("Username is already taken"));
        }

        expect(db.update).not.toHaveBeenCalled();
        expect(createToken).not.toHaveBeenCalled();
        expect(db.create).not.toHaveBeenCalled();
      });
    });
  });

  describe("login", () => {
    const db = {
      read: jest.fn(() => ({ ...user, id: userId })),
      create: jest.fn(),
      update: jest.fn(),
    };

    it("should log user in", async () => {
      const result = await login({ user, db });

      expect(db.read).toHaveBeenCalledTimes(1);
      expect(db.read).toHaveBeenCalledWith({ username: user.username });

      expect(createToken).toHaveBeenCalledTimes(1);
      expect(createToken).toHaveBeenCalledWith(userId);

      expect(db.update).toHaveBeenCalledTimes(1);
      expect(db.update).toHaveBeenCalledWith({
        user: {
          ...user,
          id: userId,
          token: jwtToken,
        },
      });

      expect(result).toEqual({
        jwt: jwtToken,
        user: {
          username: user.username,
        },
      });
    });

    describe("error cases", () => {
      it("throw error if user is empty", async () => {
        try {
          await login({ user: {}, db });
        } catch (e) {
          expect(e).toEqual(new Error("Bad credentials"));
        }

        expect(db.update).not.toHaveBeenCalled();
        expect(createToken).not.toHaveBeenCalled();
        expect(db.create).not.toHaveBeenCalled();
      });

      it("throw error if password is incorrect", async () => {
        try {
          await login({ user: { ...user, password: "123NotAnna!" }, db });
        } catch (e) {
          expect(e).toEqual(new Error("Bad credentials"));
        }

        expect(db.update).not.toHaveBeenCalled();
        expect(createToken).not.toHaveBeenCalled();
        expect(db.create).not.toHaveBeenCalled();
      });
    });
  });

  describe("authenticate", () => {
    const db = {
      read: jest.fn(() => ({ ...user, id: userId, token: jwtToken })),
      create: jest.fn(),
      update: jest.fn(),
    };

    it("should return user", () => {
      jwt.verify.mockImplementationOnce((param1, param2, callback) =>
        callback(null, { id: userId })
      );
      const promise = authenticate({ token: jwtToken, db });
      return promise.then((res) =>
        expect(res).toEqual({ ...user, id: userId, token: jwtToken })
      );
    });

    describe("error cases", () => {
      it("should return error if auth failed", () => {
        jwt.verify.mockImplementationOnce((param1, param2, callback) =>
          callback(null, { id: userId })
        );
        const promise = authenticate({ token: "falsy token", db });
        return promise.catch((err) =>
          expect(err).toEqual(new Error("Authentication failed"))
        );
      });

      it("should return error if payload is incorrect", () => {
        jwt.verify.mockImplementationOnce((param1, param2, callback) =>
          callback(null, {})
        );
        const promise = authenticate({ token: jwtToken, db });
        return promise.catch((err) =>
          expect(err).toEqual(new Error("Faulty JWT"))
        );
      });

      it("should return error if payload is empty", () => {
        jwt.verify.mockImplementationOnce((param1, param2, callback) =>
          callback(null, null)
        );
        const promise = authenticate({ token: jwtToken, db });
        return promise.catch((err) =>
          expect(err).toEqual(new Error("Faulty JWT"))
        );
      });

      it("should return error if jwt.verify passes an error", () => {
        const error = new Error({ message: "Internal jwt.verify error" });
        jwt.verify.mockImplementationOnce((param1, param2, callback) =>
          callback(error)
        );
        const promise = authenticate({ token: jwtToken, db });
        return promise.catch((err) => expect(err).toEqual(error.message));
      });
    });
  });
});
