const { Reply } = require("yandex-dialogs-sdk");

const { formatBill } = require("../lib/formatter");
const { updateSid } = require("../lib/helpers");
const { NO_RECEIPTS, EMPTY_RECEIPTS } = require("../lib/texts");

module.exports = async ctx => {
  const bill = ctx.bill;
  let reply;
  if (!bill) {
    reply = NO_RECEIPTS;
  } else if (!bill.items || !bill.items.length) {
    reply = EMPTY_RECEIPTS;
  } else {
    if (bill.sid !== ctx.sessionId) {
      await updateSid(bill, ctx.sessionId);
    }
    reply = "Ваш счёт: \n" + formatBill(bill);
  }
  return Reply.text(reply);
};
