const { Alice, Reply } = require('yandex-dialogs-sdk');
const { findOne, insert } = require('./lib/mongo');
const { countCheckTotal, hasOpenedReceipt } = require('./lib/utils');

const alice = new Alice();

alice.use(require('./lib/usermw'));

alice.any(ctx => {
    return Reply
        .text(`Привет! Я помогу тебе вести список заказанного в баре. ${hasOpenedReceipt(ctx) ? '' : 'Для начала работы скажите - Открыть чек'}`)
});

// команду на подсчёт итога надо ещё доработать
alice.command(ctx => ctx.nlu.tokens.includes('итог'), async ctx => {
    const doc = await findOne('itog', { uid: ctx.userId });
    return Reply
        .text(doc ? `Ваш счёт ${countCheckTotal(doc)} рублей` : 'У вас нет открытых чеков');
});

alice.command(['открыть чек', 'открой чек'], async ctx => {
    console.log(ctx);
    const { userId, sessionId, bill } = ctx;

    if (bill) {
        return Reply.text('Чек уже открыт');
    }

    const now = Date.now();

    await insert('checks', {
        sId: sessionId,
        uid: userId,
        created_at: now,
        updated_at: now,
        is_closed: false,
        items: []
    });

    return Reply.text('Я добавила новый чек. Чтобы добавить позицию в чек, назови блюдо или напиток, а так же его стоимость');
});

alice.command(/.+/, ctx => Reply.text('Не поняла'));

alice.listen(process.env.PORT || 3000, '');
