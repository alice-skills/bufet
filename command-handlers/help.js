const { Reply } = require("yandex-dialogs-sdk");

module.exports = ctx => {
  const words = ctx.nlu.tokens;

  if (words.includes("удали")) {
    return Reply.text("Скажи удалить, и я удалю последнюю позицию в счете");
  }

  if (words.includes("добавить") || words.includes("записать")) {
    return Reply.text("Скажи что хочешь заказать и стоимость");
  }

  if (words.includes("итог") || words.includes("посчитать")) {
    return Reply.text('Нужно сказать "Посчитай меня"');
  }

  if (words.includes("счет")) {
    return Reply.text(
      "Чтобы увидеть свой счет, нужно попросить меня показать его, а еще можно закрывать счета и открывать новые"
    );
  }

  return Reply.text(
    "Я умею многое! Создавать и закрывать счета, добавлять и удалять, подводить итог и выводить список."
  );
};
