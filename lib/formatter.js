const formatBill = bill => {
    const strings = bill.items.map(({ title, cost, count = 1 }, i) => {
        return `${i + 1}) ${title}, ${count}шт. — ${cost}р.`;
    })

    return strings.join('\n');
}

module.exports = { formatBill };
