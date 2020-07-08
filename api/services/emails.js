let from = '"Mamun Team" <mamun@example.com>'
let tokenExpired = Math.floor(sails.config.custom.resetPasswordLinkExpireTime / 60000);

module.exports.passwordRecovery = async function (to, reset_url) {

    let mailOptions = {
        from: from,
        to: to,
        subject: 'Password Rest Notification',
        text: 'Hey there, it’s our first message sent with Nodemailer ',
        html: '<div style="padding: 50px">\n' +
            '        <b>Hello!</b>\n' +
            '        <p>You are receiving this email because we received a password reset request for your account.</p>\n' +
            '        <div style="text-align: center;margin-bottom: 30px;margin-top: 30px">\n' +
            '            <a style="padding: 12px;\n' +
            '                background: #3f51b5;\n' +
            '                color: #fff;\n' +
            '                text-decoration: none;\n' +
            '                border-radius: 3px;\n' +
            '                border-color: #3f51b5"\n' +
            '                href="'+reset_url+'">\n' +
            '                Reset Password\n' +
            '            </a>\n' +
            '        </div>\n' +
            '        <p>This password reset link will expire in '+tokenExpired+' minutes.</p>\n' +
            '        <p>If you did not request a password reset, no further action is required.</p>\n' +
            '        Regards,<br>\n' +
            '        Exonhost\n' +
            '    </div>'
    };

    await emailService.sendEmail(mailOptions);
};

