const { Alice, Reply } = require('yandex-dialogs-sdk');
const { findOne, updateOne } = require('./lib/mongo');
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
alice.command(ctx => ctx.nlu.tokens.includes('итог'), async ctx => {
    const doc = await findOne('itog', {uid: ctx.userId});
    return Reply
        .text(doc ? `Ваш счёт ${countCheckTotal(doc)} рублей` : 'У вас нет открытых чеков');
});

alice.command(ctx => {
    const words = ctx.nlu.tokens;

    return words.includes('удали');
}, async ctx => {

    const items = ctx.bill && ctx.bill.items || [] ;

    if (items.length === 0) {
        return Reply.text('В счете пусто, нечего удалять!')
    }

    const lastItem = items.pop();

    await updateOne('checks', {_id: ctx.bill._id}, { $pop:  { items: 1 } });

    return Reply
        .text( `Удалила ${lastItem.title} стоимостью ${lastItem.cost} рублей`);
});

alice.command(/.+/, ctx => Reply.text('Не поняла'));

alice.listen(process.env.PORT || 3000, '');
