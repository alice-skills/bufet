function checkTotal(ctx) {
    const { tokens } = ctx.nlu;

    return (tokens.includes('подведи') && tokens.includes('итог'))
        || (tokens.includes('посчитай') && tokens.includes('меня'))
        || tokens.includes('сколько');
}

function closeCheck(ctx) {
    const { tokens } = ctx.nlu;

    return tokens.includes('закрыть') || tokens.includes('закрой');
}

module.exports = {
    checkTotal,
    closeCheck
};
