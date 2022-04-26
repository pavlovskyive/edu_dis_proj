import { cardStatuses } from "./cards.config.js";

export const validateCard = ({ card }) => {
  const isTitleValid = card.title && card.title.length > 0;
  const isStatusValid = cardStatuses.includes(card.status);
  const isDescriptionValid = card.description && card.description.length > 0;

  return isTitleValid && isStatusValid && isDescriptionValid;
};
