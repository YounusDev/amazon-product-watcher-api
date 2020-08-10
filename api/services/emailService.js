let nodemailer = require("nodemailer");

module.exports.sendEmail = async function (mailOptions) {
    let emailCredential = sails.config.custom.emailCredential;

    let transport = nodemailer.createTransport({
        host: emailCredential.host,
        port: 2525,
        auth: {
            user: emailCredential.user,
            pass: emailCredential.pass,
        },
    });

    await transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
    });
};
