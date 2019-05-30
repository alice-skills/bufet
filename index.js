const { Alice, Reply } = require('yandex-dialogs-sdk');
const { formatBill } = require('./lib/formatter');
const { updateSid, createSession } = require('./lib/helpers');
const { checkTotal } = require('./lib/filters');
const { updateOne } = require('./lig/mongo');
const { countCheckTotal, hasNumber, deleteLeftHandExcessTokens, hasOpenedReceipt } = require('./lib/utils');

const alice = new Alice();

const NO_RECEIPTS = 'У вас нет открытых чеков';
const EMPTY_RECEIPTS = 'Ваш чек пока пуст';

alice.use(require('./lib/usermw'));

alice.any(ctx => {
    return Reply
        .text(`Привет! Я помогу тебе вести список заказанного в баре. ${hasOpenedReceipt(ctx) ? '' : 'Для начала работы скажите - Открыть чек'}`)
});

const stopWords = [
    'доллар', 'евро', 'бакс'
];

alice.command(ctx => {
    const { tokens } = ctx.nlu;

    return tokens.some(token => stopWords.some(stopWord => token.includes(stopWord)));
}, () => {
    return Reply.text('Извини, я не могу работать с другими валютами, кроме рубля');
});

alice.command(checkTotal, async ctx => {
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

// покажи чек
// покажи счет
// покажи счёт
alice.command(/покажи (чек|сч[её]т)/i, ctx => {
    const bill = ctx.bill;
    let reply;
    if (!bill) {
        reply = NO_RECEIPTS;
    } else if (!bill.items || !bill.items.length) {
        reply = EMPTY_RECEIPTS
    } else {
        reply = 'Ваш счёт: \n' + formatBill(bill);
    }
    return Reply.text(reply);
});

// открыть чек
// открыть счет
// открыть счёт
// открой чек
// открой счет
// открой счёт
alice.command(/откр(ыть|ой) (чек|сч[её]т)/i, async ctx => {
    const { userId, sessionId } = ctx;

    if (hasOpenedReceipt(ctx)) {
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

// Команда добавления позиции в чек
alice.command(ctx => {
    const { tokens } = ctx.nlu;

    return hasNumber(tokens);
}, ctx => {
    const { tokens } = ctx.nlu;

    const introductoryTokens = ['добавь', 'запиши', 'заказал'];

    let startIndex;
    let clippedArray;

    startIndex = tokens.findIndex(token => introductoryTokens.includes(token.toLowerCase()));
    clippedArray = tokens.slice(startIndex + 1);
    deleteLeftHandExcessTokens(clippedArray);
    clippedArray.reverse();

    startIndex = clippedArray.findIndex(token => !isNaN(parseInt(token, 10)));
    clippedArray = clippedArray.slice(startIndex + 1);
    deleteLeftHandExcessTokens(clippedArray);
    clippedArray.reverse();

    const cost = [...tokens].reverse().find(token => !isNaN(parseInt(token, 10)));

    return Reply.text(`Я распознала: ${clippedArray.join(' ')}, 1 штука, ${cost}р.`);
})

// команда удаления
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

alice.command(/.+/, () => Reply.text('Не поняла'));

alice.listen(process.env.PORT || 3000, '');
