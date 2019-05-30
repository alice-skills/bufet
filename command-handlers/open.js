const { Reply } = require("yandex-dialogs-sdk");

const { createSession } = require("../lib/helpers");
const { SAY_DISH_AND_COST_TO_ADD } = require("../lib/texts");
const { hasOpenedReceipt } = require("../lib/utils");

module.exports = async ctx => {
  const { userId, sessionId } = ctx;

  if (hasOpenedReceipt(ctx)) {
    return Reply.text("Чек уже открыт");
  }

  const now = new Date();

  await createSession({
    sId: sessionId,
    uid: userId,
    created_at: now,
    updated_at: now,
    is_closed: false,
    items: []
  });

  return Reply.text(`Я добавила новый чек. ${SAY_DISH_AND_COST_TO_ADD} `);
};
