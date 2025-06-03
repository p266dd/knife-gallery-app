import { mailer } from "./mailer";

export async function NewRegisterUserEmail({ name, email }) {
  const text = `
    Hello ${name},\n\n
    We have successfully received your registration request.\n
    Our staff will review your application and get back to you shortly. You will receive a confirmation email when your request has been approved.\n\n\n
  
    If you didn't request this, you can safely ignore this email.\n\n
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
          <h2 style="font-size: 22px; margin-bottom: 30px; ">New User Registration</h2>
          <p>Hello ${name}, We have successfully received your registration request.<br />
            Our staff will review your application and get back to you shortly. 
            You will receive a confirmation email when your request has been approved.
          </p>
          <br />
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p class="footer">Best, <br> Ironclad</p>
        </div>
      </body>
    </html>
  `;

  return await mailer.sendMail({
    from: `'Ironclad' <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "New User Registration",
    text: text,
    html: html,
  });
}
