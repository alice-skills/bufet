function hasOpenedReceipt(ctx) {
    return !!ctx.bill;
}

const hasNumber = tokens => tokens.some(token => !isNaN(parseInt(token, 10)));

const deleteLeftHandExcessTokens = tokens => {
    const excessTokens = [
        'в',
        'на',
        'за',
        'мне',
        'мой',
        'по',
        'пожалуйста',
        'список',
        'стоимости',
        'счет',
        'счёт',
        'сюда',
        'цене',
        'чек',
        'этот'
    ];

    let canDelete = true;

    while (canDelete) {
        if (excessTokens.includes(tokens[0].toLowerCase())) {
            tokens.shift();
        } else {
            canDelete = false;
        }
    }
}

module.exports = {
    deleteLeftHandExcessTokens,
    hasNumber,
    hasOpenedReceipt
};
