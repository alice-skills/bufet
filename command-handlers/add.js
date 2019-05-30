const { Reply } = require("yandex-dialogs-sdk");

const { NO_RECEIPTS, SAY_OPEN_TO_START } = require("../lib/texts");
const { addItem } = require("../lib/helpers");
const {
  deleteLeftHandExcessTokens,
  hasNumber,
  hasOpenedReceipt
} = require("../lib/utils");

const checkTokens = ctx => {
  const { tokens } = ctx.nlu;

  return hasNumber(tokens) && !hasNumber([tokens[0]]);
};

const add = ctx => {
  if (!hasOpenedReceipt(ctx)) {
    return Reply.text(`${NO_RECEIPTS} ${SAY_OPEN_TO_START}`);
  }

  const { tokens } = ctx.nlu;

  const introductoryTokens = ["добавь", "запиши", "заказал", "хочу"];

  let startIndex;
  let clippedArray;

  startIndex = tokens.findIndex(token =>
    introductoryTokens.includes(token.toLowerCase())
  );
  clippedArray = tokens.slice(startIndex + 1);
  deleteLeftHandExcessTokens(clippedArray);
  clippedArray.reverse();

  startIndex = clippedArray.findIndex(token => !isNaN(parseInt(token, 10)));
  clippedArray = clippedArray.slice(startIndex + 1);
  deleteLeftHandExcessTokens(clippedArray);
  clippedArray.reverse();

  const cost = [...tokens].reverse().find(token => !isNaN(parseInt(token, 10)));

  const item = {
    cost,
    count: 1,
    title: clippedArray.join(" ")
  };
  console.log("tokens 3", item);

  addItem(ctx.bill, item);

  return Reply.text(
    `Я добавила: ${clippedArray.join(" ")}, 1 штука, ${cost} р.`
  );
};

module.exports = {
  checkTokens,
  add
};
