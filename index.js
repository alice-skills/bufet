const { Alice } = require('yandex-dialogs-sdk');

const { checkTotal, closeCheck } = require('./lib/filters');

const welcome = require('./command-handlers/welcome');
const help = require('./command-handlers/help');
const deleteHandler = require('./command-handlers/delete');
const closeHandler = require('./command-handlers/close');
const open = require('./command-handlers/open');
const getTotal = require('./command-handlers/get-total');
const continueHandler = require('./command-handlers/continue');
const currencyChecker = require('./command-handlers/currency-checker');
const add = require('./command-handlers/add');
const errorHandler = require('./command-handlers/error');

const alice = new Alice();

alice.use(require('./lib/usermw'));

// Приветствие
alice.any(welcome);

// Команда вызова справки
alice.command(/справка|что ты умеешь|что делать|навык|помоги|помощь/i, help);

// Команда обработки невалидных валют
alice.command(currencyChecker);

// Команда удаления чека
alice.command(/удали(|ть)/i, deleteHandler);

// Команда закрытия чека
alice.command(closeCheck, closeHandler);

// Команды показа итога
alice.command(checkTotal, getTotal);
alice.command(/покажи (чек|сч[её]т)/i, getTotal);

// Команда открытия чека
alice.command(/откр(ыть|ой) (чек|сч[её]т)/i, open);

// Команда продолжения чека
alice.command(/продолжи(|ть) (чек|сч[её]т)/i, continueHandler);

// Команда добавления позиции в чек
alice.command(add.checkTokens, add.add);

alice.command(/.+/, errorHandler);

alice.listen(process.env.PORT || 3000, '');
