const { Alice, Reply } = require('yandex-dialogs-sdk');

const alice = new Alice();

alice.any(async ctx => Reply.text(`Эни финг`));

const server = alice.listen(process.env.PORT || 3000, '');
