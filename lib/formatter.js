const countCheckTotal = check => {
    if (!check && !Array.isArray(check.items)) {
        throw new Error('Check object invalid');
    }

    let total = 0;

    check.items.forEach(({ count, cost } = {}) => {
        if (!cost || cost < 0) return;

        if (!count || count < 0) {
            count = 1;
        }

        total += cost * count;
    });

    return total;
}

const formatBill = bill => {
    const strings = [''];

    strings.push(...bill.items.map(({ title, cost, count = 1 }, i) => {
        return `${i + 1}) ${title}, ${count}шт. — ${cost}р.`;
    }));

    strings.push('', `Итого: ${countCheckTotal(bill)}р.`)

    return strings.join('\n');
}

module.exports = { formatBill };
