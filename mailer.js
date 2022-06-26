const nodemailer = require('nodemailer')

async function Mailer (email, code) {
    let transporter = nodemailer.createTransport({
        service: 'yandex',
        auth: {
        user: 'diplom.prototype@yandex.ru',
        pass: 'QFizZ7f!vsciFwC',
        },
    })
    await transporter.sendMail({
        from: '"Robot" <diplom.prototype@yandex.ru>',
        to: email,
        subject: 'Code from Prototype',
        text: 'This code ' + code + ' was sent automatically from Prototype.',
        html:
          'This code <strong>'+ code + '</strong> was sent from <i>Prototype</i>.',
    });
}
module.exports = {Mailer};