const { Alice, Reply } = require('yandex-dialogs-sdk');
const { findOne } = require('./lib/mongo');
const { countCheckTotal, hasOpenedReceipt } = require('./lib/utils');

const alice = new Alice();

alice.use(require('./lib/usermw'));

alice.any(ctx => {
    return Reply
        .text(`Привет! Я помогу тебе вести список заказанного в баре. ${hasOpenedReceipt(ctx) ? '' : 'Для начала работы скажите - Открыть чек'}`)
});

alice.command(ctx => {
    const words = ctx.nlu.tokens;

    return words.includes('открыть') && words.includes('чек');
}, ctx => {
    return Reply
        .text(hasOpenedReceipt(ctx) ? 'Открываю' : 'У вас нет открытых чеков');
});

// команду на подсчёт итога надо ещё доработать
alice.command(ctx => ctx.nlu.tokens.includes('итог'), async ctx => {
    const doc = await findOne('itog', {uid: ctx.userId});
    return Reply
        .text(doc ? `Ваш счёт ${countCheckTotal(doc)} рублей` : 'У вас нет открытых чеков');
});

alice.command(/.+/, ctx => Reply.text('Не поняла'));

alice.listen(process.env.PORT || 3000, '');
