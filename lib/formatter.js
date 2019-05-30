const { countCheckTotal } = require('./utils');

const formatBill = bill => {
    const strings = [''];

    strings.push(...bill.items.map(({ title, cost, count = 1 }, i) => {
        return `${i + 1}) ${title}, ${count}шт. — ${cost}р.`;
    }));

    strings.push('', `Итого: ${countCheckTotal(bill)}р.`)

    return strings.join('\n');
}

module.exports = { formatBill };
