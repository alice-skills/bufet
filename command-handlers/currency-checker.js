const { Reply } = require("yandex-dialogs-sdk");

const stopWords = ["доллар", "евро", "бакс"];

(module.exports = ctx => {
  const { tokens } = ctx.nlu;

  return tokens.some(token =>
    stopWords.some(stopWord => token.includes(stopWord))
  );
}),
  () => {
    return Reply.text(
      "Извини, я не могу работать с другими валютами, кроме рубля"
    );
  };
