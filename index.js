const { Alice, Reply } = require('yandex-dialogs-sdk');

const { formatBill } = require('./lib/formatter');
const { updateSid, createSession, addItem, close } = require('./lib/helpers');
const { checkTotal, closeCheck } = require('./lib/filters');
const { updateOne } = require('./lib/mongo');
const { deleteLeftHandExcessTokens, hasNumber, hasOpenedReceipt } = require('./lib/utils');

const alice = new Alice();

const NO_RECEIPTS = 'У вас нет открытых чеков';
const EMPTY_RECEIPTS = 'Ваш чек пока пуст';
const SAY_OPEN_TO_START = 'Для начала работы скажите - Открыть чек';
const SAY_DISH_AND_COST_TO_ADD = 'Чтобы добавить позицию в чек, назови блюдо или напиток, а так же его стоимость';

alice.use(require('./lib/usermw'));

alice.any(ctx => {
    return Reply
        .text(`Привет! Я помогу тебе вести список заказанного в баре. ${hasOpenedReceipt(ctx) ? '' : SAY_OPEN_TO_START}`)
});

//справка
alice.command(/справка|что ты умеешь|что делать|навык|помоги|помощь/i, ctx => {
    const words = ctx.nlu.tokens;

    if (words.includes('удали')) {
        return Reply.text("Скажи удалить, и я удалю последнюю позицию в счете");
    }

    if (words.includes('добавить') || words.includes('записать')) {
        return Reply.text("Скажи что хочешь заказать и стоимость");
    }

    if (words.includes('итог') || words.includes('посчитать')) {
        return Reply.text("Нужно сказать \"Посчитай меня\"");
    }

    if (words.includes('счет')) {
        return Reply.text("Чтобы увидеть свой счет, нужно попросить меня показать его, а еще можно закрывать счета и открывать новые");
    }

    return Reply.text("Я умею многое! Создавать и закрывать счета, добавлять и удалять, подводить итог и выводить список.");
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

// посчитай меня
// подведи итог
// сколько
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

// закрыть
alice.command(closeCheck, async ctx => {
    if (!ctx.bill) {
        return Reply.text(NO_RECEIPTS);
    }
    if (!Array.isArray(ctx.bill.items) || ctx.bill.items.length <= 0) {
        return Reply.text(EMPTY_RECEIPTS);
    }

    await close(ctx.bill);

    return Reply.text({
        text: 'Ваш счёт: \n' + formatBill(ctx.bill),
        tts: `Ваш счёт на сумму ${countCheckTotal(ctx.bill)} рублей`
    });
});

const getTotal = async ctx => {
    const bill = ctx.bill;
    let reply;
    if (!bill) {
        reply = NO_RECEIPTS;
    } else if (!bill.items || !bill.items.length) {
        reply = EMPTY_RECEIPTS
    } else {
        if (bill.sid !== ctx.sessionId) {
            await updateSid(bill, ctx.sessionId);
        }
        reply = 'Ваш счёт: \n' + formatBill(bill);
    }
    return Reply.text(reply);
};

// подведи итог
// посчитай меня
// сколько
alice.command(checkTotal, getTotal);

// покажи чек
// покажи счет
// покажи счёт
alice.command(/покажи (чек|сч[её]т)/i, getTotal);

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

    const now = new Date();

    await createSession({
        sId: sessionId,
        uid: userId,
        created_at: now,
        updated_at: now,
        is_closed: false,
        items: []
    });

    return Reply.text(`Я добавила новый чек. ${SAY_DISH_AND_COST_TO_ADD}`);
});

// продолжи чек
// продолжи счет
// продолжи счёт
// продолжить чек
// продолжить счет
// продолжить счёт
alice.command(/продолжи(|ть) (чек|сч[её]т)/i, ctx => {
    if (hasOpenedReceipt(ctx)) {
        return Reply.text(SAY_DISH_AND_COST_TO_ADD);
    }

    return Reply.text(`${NO_RECEIPTS}. ${SAY_OPEN_TO_START}`);
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

    const item = {
        cost,
        count: 1,
        title: clippedArray.join(' ')
    };

    addItem(ctx.bill, item)

    return Reply.text(`Я добавила: ${clippedArray.join(' ')}, 1 штука, ${cost}р.`);
})

alice.command(/.+/, () => Reply.text('Не поняла'));

alice.listen(process.env.PORT || 3000, '');

