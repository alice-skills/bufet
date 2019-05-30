const { Alice, Reply } = require('yandex-dialogs-sdk');
const { countCheckTotal, hasOpenedReceipt } = require('./lib/utils');
const { formatBill } = require('./lib/formatter');
const { updateSid, createSession } = require('./lib/helpers');
const { checkTotal } = require('./lib/filters');

const alice = new Alice();

const NO_RECEIPTS = 'У вас нет открытых чеков';

alice.use(require('./lib/usermw'));

alice.any(ctx => {
    return Reply
        .text(`Привет! Я помогу тебе вести список заказанного в баре. ${hasOpenedReceipt(ctx) ? '' : 'Для начала работы скажите - Открыть чек'}`)
});

lice.command(checkTotal, async ctx => {
    if (!ctx.bill) {
        return Reply.text(NO_RECEIPTS);
    }
    if (ctx.bill.sid !== ctx.sessionId) {
        await updateSid(ctx.bill, ctx.sessionId);
    }
    if (!Array.isArray(ctx.bill.items) || ctx.bill.items.length <= 0) {
        return Reply.text('У вас нет добавленных позиций');
    }

    return Reply.text(`Ваш счёт ${countCheckTotal(ctx.bill)} рублей`);
});

alice.command(/покажи сч[её]т/i, ctx => {
    const bill = ctx.bill;
    let reply;
    if (!bill) {
        reply = NO_RECEIPTS;
    } else if (!bill.items || !bill.items.length) {
        reply = NO_RECEIPTS
    } else {
        reply = 'Ваш счёт: \n' + formatBill(bill);
    }
    return Reply.text(reply);
});

alice.command(['открыть чек', 'открой чек'], async ctx => {
    const { userId, sessionId, bill } = ctx;

    if (bill) {
        return Reply.text('Чек уже открыт');
    }

    const now = Date.now();

    await createSession({
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
