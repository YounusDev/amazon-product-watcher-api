var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
   host: "smtp.mailtrap.io",
   port: 2525,
   auth: {
       user: "bd94d899165ecf",
       pass: "7452ea52f7de5d"
   }
});
module.exports.transport = transport
