const { Reply } = require("yandex-dialogs-sdk");

const {
  NO_RECEIPTS,
  SAY_OPEN_TO_START,
  SAY_DISH_AND_COST_TO_ADD
} = require("../lib/texts");
const { hasOpenedReceipt } = require("../lib/utils");

module.exports = ctx => {
  if (hasOpenedReceipt(ctx)) {
    return Reply.text(SAY_DISH_AND_COST_TO_ADD);
  }

  return Reply.text(`${NO_RECEIPTS}.${SAY_OPEN_TO_START} `);
};
