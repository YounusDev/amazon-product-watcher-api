let from = '"Mamun Team" <mamun@example.com>';
let tokenExpired = Math.floor(
    sails.config.custom.resetPasswordLinkExpireTime / 60000
);
let regards = "Exonhost";

module.exports.passwordRecovery = async function (to, url) {
    let mailOptions = {
        from: from,
        to: to,
        subject: "Password Rest Notification",
        html:
            '<div style="padding: 50px;max-width: 600px">\n' +
            "        <b>Hello!</b>\n" +
            "        <p>You are receiving this email because we received a password reset request for your account.</p>\n" +
            '        <div style="text-align: center;margin-bottom: 30px;margin-top: 30px">\n' +
            '            <a style="padding: 12px;\n' +
            "                background: #3f51b5;\n" +
            "                color: #fff;\n" +
            "                text-decoration: none;\n" +
            "                border-radius: 3px;\n" +
            '                border-color: #3f51b5"\n' +
            '                href="' +
            url +
            '">\n' +
            "                Reset Password\n" +
            "            </a>\n" +
            "        </div>\n" +
            "        <p>This password reset link will expire in " +
            tokenExpired +
            " minutes.</p>\n" +
            "        <p>If you did not request a password reset, no further action is required.</p>\n" +
            "        Regards,<br>\n" +
            "        " +
            regards +
            "\n" +
            "    </div>",
    };

    await emailService.sendEmail(mailOptions);
};

module.exports.accountVerification = async function (to, url) {
    let mailOptions = {
        from: from,
        to: to,
        subject: "Account Verification Notification",
        html:
            ' <div style="padding: 50px;max-width: 600px">\n' +
            "        <b>Hello!</b>\n" +
            "        <p>Please click the button below to verify your email address.</p>\n" +
            '        <div style="text-align: center;margin-bottom: 30px;margin-top: 30px">\n' +
            '            <a style="padding: 12px;\n' +
            "                background: #3f51b5;\n" +
            "                color: #fff;\n" +
            "                text-decoration: none;\n" +
            "                border-radius: 3px;\n" +
            '                border-color: #3f51b5"\n' +
            '                href="' +
            url +
            '"\n' +
            "            >\n" +
            "                Verify Email Address\n" +
            "            </a>\n" +
            "        </div>\n" +
            "        <p>If you did not create an account, no further action is required.</p>\n" +
            "        Regards,<br>\n" +
            "        " +
            regards +
            "\n" +
            "    </div>",
    };

    await emailService.sendEmail(mailOptions);
};
