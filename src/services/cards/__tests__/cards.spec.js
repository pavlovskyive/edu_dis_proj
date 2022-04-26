import { randomUUID } from "crypto";

import {
  createCard,
  getCards,
  getCard,
  updateCard,
  deleteCard,
} from "../cards";
import { cardStatuses } from "../cards.constants.js";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

describe("Cards service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mocked input data
  const cardId = "305hvrj2-92nd-205n-2mf9-jsf933nkv2bd";
  const user = {
    id: "74e631c4-50bc-4109-8e68-f2bc66fe2c24",
    username: "Anna",
    password: "048PJs52",
    cards: [
      {
        id: cardId,
        title: "Card title",
        description: "Card description",
        status: cardStatuses[1],
      },
    ],
  };
  const db = {
    update: jest.fn(),
  };

  // Util to check whether test case throws error
  // * adapted to work with each card method *
  const expectErrorOutput = async ({ fn, user, card, cardId, db, err }) => {
    try {
      await fn({ user, card, cardId, db });
    } catch (e) {
      expect(e).toEqual(err ? new Error(err) : new Error("Invalid card data"));
    }

    expect(db.update).not.toHaveBeenCalled();
  };

  describe("createCard", () => {
    it("should create new card if all params are correct", async () => {
      const newCardId = "58vh653i-87gb-9527-6b42-h6tsm889ikc5";
      randomUUID.mockReturnValueOnce(newCardId);

      const card = {
        title: "New card title",
        description: "New card description",
        status: cardStatuses[0],
      };
      const result = await createCard({ user, card, db });

      expect(db.update).toHaveBeenCalledTimes(1);
      expect(db.update).toHaveBeenCalledWith({ user });

      expect(result).toEqual({ ...card, id: newCardId });
    });

    describe("error cases", () => {
      it("should throw error if title is empty", async () => {
        const card = {
          title: "",
          description: "New card description",
          status: cardStatuses[0],
        };

        await expectErrorOutput({ fn: createCard, user, card, db });
      });

      it("should throw error if title is absent", async () => {
        const card = {
          description: "New card description",
          status: cardStatuses[0],
        };

        await expectErrorOutput({ fn: createCard, user, card, db });
      });

      it("should throw error if status is not valid", async () => {
        const card = {
          title: "Card title",
          description: "New card description",
          status: "Falsy status",
        };

        await expectErrorOutput({ fn: createCard, user, card, db });
      });

      it("should throw error if description is empty", async () => {
        const card = {
          title: "Card title",
          description: "",
          status: cardStatuses[0],
        };

        await expectErrorOutput({ fn: createCard, user, card, db });
      });

      it("should throw error if description is absent", async () => {
        const card = {
          title: "Card title",
          status: cardStatuses[0],
        };

        await expectErrorOutput({ fn: createCard, user, card, db });
      });
    });
  });

  describe("getCards", () => {
    it("should return correct value for user cards", () => {
      const cards = getCards({ user });

      expect(cards).toEqual(user.cards);
    });

    it("should return empty array if user has no cards", () => {
      const cards = getCards({ user: { id: user.id } });

      expect(cards).toEqual([]);
    });
  });

  describe("getCard", () => {
    it("should return card from user by card id", () => {
      const card = getCard({ user, cardId });

      expect(card).toEqual(user.cards[0]);
    });

    it("should throw error is absent in user cards", () => {
      expect(() => getCard({ user, cardId: "falsyId" })).toThrow(
        "Data doesnt exist"
      );
    });
  });

  describe("updateCard", () => {
    const correctCard = {
      id: user.cards[0].id,
      title: "New card title",
      description: "New card description",
      status: cardStatuses[2],
    };

    it("should update card and db if all params are correct", async () => {
      const result = await updateCard({ user, card: correctCard, db });

      expect(db.update).toHaveBeenCalledTimes(1);
      expect(db.update).toHaveBeenCalledWith({ user });

      expect(result).toEqual(correctCard);
    });

    describe("error cases", () => {
      it("should throw error if has no cards with matching id", async () => {
        const card = {
          ...correctCard,
          id: "Falsy id",
        };

        await expectErrorOutput({
          fn: updateCard,
          user,
          card,
          db,
          err: "Data doesnt exist",
        });
      });

      it("should throw error if title is empty", async () => {
        const card = {
          ...correctCard,
          title: "",
        };

        await expectErrorOutput({ fn: updateCard, user, card, db });
      });

      it("should throw error if title is absent", async () => {
        const card = {
          id: correctCard.id,
          description: "New card description",
          status: cardStatuses[0],
        };

        await expectErrorOutput({ fn: updateCard, user, card, db });
      });

      it("should throw error if status is not valid", async () => {
        const card = {
          ...correctCard,
          status: "Falsy status",
        };

        await expectErrorOutput({ fn: updateCard, user, card, db });
      });

      it("should throw error if description is empty", async () => {
        const card = {
          ...correctCard,
          description: "",
        };

        await expectErrorOutput({ fn: updateCard, user, card, db });
      });

      it("should throw error if description is absent", async () => {
        const card = {
          id: correctCard.id,
          title: "Card title",
          status: cardStatuses[0],
        };

        await expectErrorOutput({ fn: updateCard, user, card, db });
      });
    });
  });

  describe("deleteCard", () => {
    it("should update card and db if all params are correct", async () => {
      await deleteCard({ user, cardId, db });

      expect(db.update).toHaveBeenCalledTimes(1);
      expect(db.update).toHaveBeenCalledWith({ user });
    });

    describe("error cases", () => {
      it("should throw error if has no cards with matching id", async () => {
        await expectErrorOutput({
          fn: deleteCard,
          user,
          cardId: "Falsy id",
          db,
          err: "Data doesnt exist",
        });
      });
    });
  });
});
