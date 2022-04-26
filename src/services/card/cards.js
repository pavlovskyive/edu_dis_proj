import { randomUUID } from "crypto";

import { validateCard } from "./cards.utils";

const getCards = ({ user }) => user.cards || [];

const getCard = ({ user, cardId }) =>
  user.cards.find((card) => card.id == cardId) || {};

const createCard = async ({ user, card, db }) => {
  const isCardValid = validateCard({ card });

  card.id = randomUUID();

  if (isCardValid) {
    user.cards.push(card);
  } else {
    throw new Error("Card not valid");
  }

  await db.update({ user });
  return card;
};

const updateCard = async ({ user, card, db }) => {
  const index = user.cards.findIndex((e) => e.id == card.id);

  if (index === -1) {
    throw new Error("Card not exist");
  }

  const isCardValid = validateCard({ card });

  if (isCardValid) {
    user.cards[index] = card;
  } else {
    throw new Error("Card not valid");
  }

  await db.update({ user });
  return card;
};

const deleteCard = async ({ user, cardId, db }) => {
  const index = user.cards.findIndex((e) => e.id == cardId);

  if (index === -1) {
    throw new Error("Card not exist");
  }

  user.cards.splice(index, 1);

  await db.update({ user });
};

export { createCard, getCards, getCard, updateCard, deleteCard };
