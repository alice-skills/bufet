function countCheckTotal(check) {
    if (!check && !Array.isArray(check.items)) {
        throw new Error('Check object invalid');
    }

    let total = 0;

    check.items.forEach(({count, cost} = {}) => {
        if (!cost || cost < 0) return;

        if (!count || count < 0) {
            count = 1;
        }

        total += cost * count;
    });

    return total;
}

function hasOpenedReceipt(ctx) {
    return !!ctx.bill;
}

module.exports = {
    countCheckTotal,
    hasOpenedReceipt
};
