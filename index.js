const { Alice, Reply } = require('yandex-dialogs-sdk');

const alice = new Alice();

const hasOpenedReceipt = userId => {
    // TODO: check in DB.

    return false;
};

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

alice.command(/.+/, ctx => Reply.text('Не поняла'));

alice.listen(process.env.PORT || 3000, '');
