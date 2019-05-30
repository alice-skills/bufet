const { findOne } = require('./mongo');

const BILL_COLLECTION = require('./collection');

async function userBillMiddleware (ctx, next) {
    const userId = ctx.userId;
    ctx.bill = await findOne(BILL_COLLECTION, {uid: userId, is_closed: false});
    return next(ctx);
};

module.exports = userBillMiddleware;
