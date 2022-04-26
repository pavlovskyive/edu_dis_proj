import jwt from "jsonwebtoken";

import { verifyToken, createToken } from "../token";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("token utils", () => {
  const jwtTokenParts = [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "eyJpZCI6IjQzNzcxMDI0LWNhNDktNDFmYS05",
    "ccPCj1DjN0nc-du6x9gjXU8qM3f-6ED614vE",
  ];
  const jwtToken = jwtTokenParts.join(".");

  describe("createToken", () => {
    jwt.sign.mockReturnValue(jwtToken);

    it("should kreate token by id and key", () => {
      const id = "58vh653i-87gb-9527-6b42-h6tsm889ikc5";
      const token = createToken(id);

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith({ id: id }, process.env.JWT_KEY);
      expect(token).toBe(jwtToken);
    });
  });

  describe("verifyToken", () => {
    const req = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    it("should verify token", () => {
      verifyToken(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should send 403 error if bearer is undefined", () => {
      verifyToken({ headers: {} }, res, next);

      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(403);
    });
  });
});
