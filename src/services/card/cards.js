import {randomUUID} from 'crypto';

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} password
 * @property {string} id
 */

/**
 * @typedef {Object} Card
 * @property {string} title
 * @property {string} status
 * @property {string} description
 * @property {string} id
 */

/**
 * Card statuses
 */
const cardStatuses = ['to_do', 'in_progress', 'testing', 'done'];

/**
 * Get all user's cards
 * @param {User} user
 * @return {Array<Card>} user's cards
 */
const getCards = ({user}) => user.cards;

/**
 * Get user's card by card id
 * @param {Object} param
 * @param {User} param.user user
 * @param {string} param.cardId card id
 * @return {Card} user's card with given id
 */
const getCard = ({user, cardId}) => {
  const card = user.cards.find((card) => card.id == cardId);
  if (!card) {
    throw new Error('No such card');
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
const createCard = async ({user, card, db}) => {
  const isTitleValid = card.title && card.title.length !== 0;
  const isStatusValid = cardStatuses.includes(card.status);
  const isDescriptionValid = card.description && card.description.length;

  card.id = randomUUID();

  if (isTitleValid && isStatusValid && isDescriptionValid) {
    user.cards.push(card);
  } else {
    throw new Error('Card not valid');
  }

  await db.update({user});
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
const updateCard = async ({user, card, db}) => {
  const index = user.cards.findIndex((e) => e.id == card.id);

  if (index === -1) {
    throw new Error('Card not exist');
  }

  const isTitleValid = card.title && card.title.length !== 0;
  const isStatusValid = cardStatuses.includes(card.status);
  const isDescriptionValid = card.description && card.description.length;

  if (isTitleValid && isStatusValid && isDescriptionValid) {
    user.cards[index] = card;
  } else {
    throw new Error('Card not valid');
  }

  await db.update({user});
  return card;
};

/**
 * Deletes user's card with given id
 * @param {Object} param
 * @param {User} param.user user
 * @param {string} param.cardId card id
 * @param {Object} param.db database
 */
const deleteCard = async ({user, cardId, db}) => {
  const index = user.cards.findIndex((e) => e.id == cardId);

  if (index === -1) {
    throw new Error('Card not exist');
  }

  user.cards.splice(index, 1);

  await db.update({user});
};

export {createCard, getCards, getCard, updateCard, deleteCard};
