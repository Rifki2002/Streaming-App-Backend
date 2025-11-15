import nodemailer from "nodemailer";

export const sendVerificationEmail = async (toEmail, token) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "budi@gmail.com",
      pass: "123456",
    },
  });

  const verifyUrl = `http://localhost:3000/api/verifikasi-email?token=${token}`;
  const mailOptions = {
    from: '"Movie App" <budi@gmail.com>',
    to: toEmail,
    subject: "Verifikasi Email Movie App",
    html: `
      <h3>Halo!</h3>
      <p>Terima kasih sudah register di Movie App.</p>
      <p>Silakan klik link berikut untuk verifikasi email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};
