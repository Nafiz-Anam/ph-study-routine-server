const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (toEmail, resetToken) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
        },
    });

    const resetURL = `${process.env.CLIENT}/reset-password/${resetToken}`;

    const body_text = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    let message = {
        from: process.env.SMTP_EMAIL,
        to: toEmail,
        subject: "Your password reset token (valid for 10 mins)",
        text: body_text,
    };

    transporter
        .sendMail(message)
        .then((info) => {
            return true;
        })
        .catch((error) => {
            // console.log(error);
            return false;
        });
};

module.exports = sendPasswordResetEmail;
