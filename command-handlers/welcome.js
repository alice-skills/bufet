const { Reply } = require("yandex-dialogs-sdk");

const { SAY_OPEN_TO_START } = require("../lib/texts");
const { hasOpenedReceipt } = require("../lib/utils");

module.exports = ctx => {
  return Reply.text(
    hasOpenedReceipt(ctx)
      ? `У тебя есть открытый чек. Что еще записать?`
      : `Привет! Я помогу тебе вести список заказанного в баре. ${SAY_OPEN_TO_START}`
  );
};
