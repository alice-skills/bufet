# bufet
Скилл для Алисы для расчета в баре

## Старт проекта

* `npm i`
* Запустить [ngrok](https://github.com/alice-skills/bufet/wiki/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9-%D1%81%D1%82%D0%B0%D1%80%D1%82-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B8-%D0%BD%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0-%D0%B4%D0%BB%D1%8F-%D0%BD%D0%B0%D0%B2%D1%8B%D0%BA%D0%B0-%D0%90%D0%BB%D0%B8%D1%81%D1%8B#%D0%94%D0%BB%D1%8F-%D0%BB%D0%BE%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B8-%D0%BF%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-ngrok) `npm run ngrok`
* Конфиг базы `export MONGO_URL=<DB_url>`
* `node index.js`

## Тест базы и примеры команд
* `npm run test:mongo`

## Как тестировать

См. [тут](https://github.com/alice-skills/bufet/wiki/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9-%D1%81%D1%82%D0%B0%D1%80%D1%82-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B8-%D0%BD%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0-%D0%B4%D0%BB%D1%8F-%D0%BD%D0%B0%D0%B2%D1%8B%D0%BA%D0%B0-%D0%90%D0%BB%D0%B8%D1%81%D1%8B#%D0%94%D0%BB%D1%8F-%D0%BB%D0%BE%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B8-%D0%BF%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-ngrok)

## Полезные ссылки

* Node.js клиент для написания своего навыка: https://github.com/fletcherist/yandex-dialogs-sdk
* Протокол работы навыка: https://yandex.ru/dev/dialogs/alice/doc/protocol-docpage/#create
* Здесь можно тестить тексты ответов (интонацию, ударения): https://webasr.yandex.net/ttsdemo.html
