let nodemailer = require('nodemailer');

module.exports.sendEmail = async function (mailOptions) {

    let transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "bd94d899165ecf",
            pass: "7452ea52f7de5d"
        }
    });

    await transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}
