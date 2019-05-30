const { Alice, Reply } = require('yandex-dialogs-sdk');
const { findOne } = require('./lib/mongo');
const { countCheckTotal } = require('./lib/utils');

const alice = new Alice();

const hasOpenedReceipt = userId => {
    // TODO: check in DB.

    return false;
};

alice.use(require('./lib/usermw'));

alice.any(ctx => {
    return Reply
        .text(`Привет! Я помогу тебе вести список заказанного в баре. ${hasOpenedReceipt(ctx.userId) ? '' : 'Для начала работы скажите - Открыть чек'}`)
});

alice.command(ctx => {
    const words = ctx.nlu.tokens;

    return words.includes('открыть') && words.includes('чек');
}, ctx => {
    return Reply
        .text(hasOpenedReceipt(ctx.userId) ? 'Открываю' : 'У вас нет открытых чеков');
});

// команду на подсчёт итога надо ещё доработать
alice.command(/^итог$/i, async ctx => {
    const doc = await findOne('itog', {uid: ctx.userId});
    return Reply
        .text(doc ? `Ваш счёт ${countCheckTotal(doc)} рублей` : 'У вас нет открытых чеков');
});

alice.command(/.+/, ctx => {
    console.log(ctx.bill);
    return Reply.text('Не поняла');
});

alice.listen(process.env.PORT || 3000, '');
