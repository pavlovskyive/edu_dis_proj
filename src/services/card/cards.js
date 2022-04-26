import { randomUUID } from "crypto";

import { validateCard } from "./cards.utils";

/**
 * @typedef {Object} Card
 * @property {string} title
 * @property {string} status
 * @property {string} description
 * @property {string} id
 */

/**
 * Get all user's cards
 * @param {User} user
 * @return {Array<Card>} user's cards
 */
const getCards = ({ user }) => user.cards || [];

/**
 * Get user's card by card id
 * @param {Object} param
 * @param {User} param.user user
 * @param {string} param.cardId card id
 * @return {Card} user's card with given id
 */
const getCard = ({ user, cardId }) => {
  const card = user.cards.find((card) => card.id == cardId);
  if (!card) {
    throw new Error("No such card");
  }
  return card;
};

/**
 * Creates card for user
 * @param {Object} param
 * @param {User} param.user user
 * @param {Card} param.card new card
 * @param {Object} param.db database
 * @return {Card} new card's info
 */
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

/**
 * Updates user's card
 * @param {Object} param
 * @param {User} param.user user
 * @param {Card} param.card new card
 * @param {Object} param.db database
 * @return {Card} updated card
 */
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

/**
 * Deletes user's card with given id
 * @param {Object} param
 * @param {User} param.user user
 * @param {string} param.cardId card id
 * @param {Object} param.db database
 */
const deleteCard = async ({ user, cardId, db }) => {
  const index = user.cards.findIndex((e) => e.id == cardId);

  if (index === -1) {
    throw new Error("Card not exist");
  }

  user.cards.splice(index, 1);

  await db.update({ user });
};

export { createCard, getCards, getCard, updateCard, deleteCard };
