import { mailer } from "./mailer";

export async function UserActivationEmail({ name, email }) {
  const text = `
    Hello ${name},\n\n
    We have activated your user account successfully.\n
    You can now log in to your account at https://app.ironclad.co.jp.\n\n\n
  
    If you didn't expect this email, you can safely ignore it.\n\n
    Best,\n
    Ironclad
  `;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          .container {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            font-size: 12px;
            color: #666;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 style="font-size: 22px; margin-bottom: 30px; ">User Activation</h2>
          <p>Hello ${name}, We have activated your user account successfully.<br />
            You can now log in to your account at <a href="" target="_blank">https://app.ironclad.co.jp<a/>.<br /><br />
            We look forward to doing business with you!
          </p>
          <br /><br /><br />
          <p>If you didn't expect this, you can safely ignore this email.</p>
          <p class="footer">Best, <br> Ironclad</p>
        </div>
      </body>
    </html>
  `;

  return await mailer.sendMail({
    from: `'Ironclad' <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "New User Activation",
    text: text,
    html: html,
  });
}
