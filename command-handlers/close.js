const { Reply } = require("yandex-dialogs-sdk");

const { formatBill, countCheckTotal } = require("../lib/formatter");
const { NO_RECEIPTS, EMPTY_RECEIPTS } = require("../lib/texts");
const { close } = require("../lib/helpers");

module.exports = async ctx => {
  if (!ctx.bill) {
    return Reply.text(NO_RECEIPTS);
  }
  if (!Array.isArray(ctx.bill.items) || ctx.bill.items.length <= 0) {
    return Reply.text(EMPTY_RECEIPTS);
  }

  await close(ctx.bill);

  return Reply.text({
    text: "Ваш счёт: \n" + formatBill(ctx.bill),
    tts: `Ваш счёт на сумму ${countCheckTotal(ctx.bill)} рублей`
  });
};
