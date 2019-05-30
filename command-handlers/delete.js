const { Reply } = require("yandex-dialogs-sdk");

const { updateOne } = require("../lib/mongo");

module.exports = async ctx => {
  const items = (ctx.bill && ctx.bill.items) || [];

  if (items.length === 0) {
    return Reply.text("В счете пусто, нечего удалять!");
  }

  const lastItem = items.pop();

  await updateOne("checks", { _id: ctx.bill._id }, { $pop: { items: 1 } });

  return Reply.text(
    `Удалила последнюю позицию: ${lastItem.title} стоимостью ${
      lastItem.cost
    } рублей`
  );
};
