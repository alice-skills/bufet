function checkTotal(ctx) {
    const { tokens } = ctx.nlu;

    return (tokens.includes('подведи') && tokens.includes('итог'))
        || (tokens.includes('посчитай') && tokens.includes('меня'))
        || tokens.includes('сколько');
}

module.exports = {
    checkTotal
};
