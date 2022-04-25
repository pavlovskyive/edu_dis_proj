import { randomUUID } from "crypto";

const cardStatuses = ["to_do", "in_progress", "testing", "done"];

const getCards = ({ user }) => user.cards;

const getCard = ({ user, cardId }) =>
  user.cards.find((card) => card.id == cardId);

const createCard = async ({ user, card, db }) => {
  const isTitleValid = card.title && card.title.length !== 0;
  const isStatusValid = cardStatuses.includes(card.status);
  const isDescriptionValid = card.description && card.description.length;

  card.id = randomUUID();

  if (isTitleValid && isStatusValid && isDescriptionValid) {
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

  const isTitleValid = card.title && card.title.length !== 0;
  const isStatusValid = cardStatuses.includes(card.status);
  const isDescriptionValid = card.description && card.description.length;

  if (isTitleValid && isStatusValid && isDescriptionValid) {
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
