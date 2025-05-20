import { mailer } from "./mailer";

export async function RecoveryCodeEmail({ code, name, email, request }) {
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host");
  const baseUrl = `${protocol}://${host}`;

  // * Format the code to be displayed in the email.
  let codeDisplay = "";
  const codeArray = code.toString().split("");
  codeArray.map((number) => {
    codeDisplay += `<span>${number}</span>`;
  });

  const text = `
    Hello ${name},\n
    Someone has requested a password recovery for your account! Please use the code below to reset your password.\n\n
    [code] ${code}\n\n
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
          .code {
              margin: 30px 0;
          }
          .code span {
            display: inline-block;
            padding: 8px 10px;
            margin-right: 4px;
            background-color: #f1f1f1;
            color: #aaaaaa;
            font-size: 30px;
            border-radius: 8px;
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
          <h2>Password Recovery Code</h2>
          <p>Someone has requested a password recovery for your account! Please use the code below to reset your password.</p>
          <p class="code">
            ${codeDisplay}
          </p>
          <p><a href="'${baseUrl}/reset-password'" target="_blank">Click here </a>to go to the reset page.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p class="footer">Best, <br> Ironclad</p>
        </div>
      </body>
    </html>
  `;

  return await mailer.sendMail({
    from: "'Ironclad' merle.wuckert@ethereal.email",
    to: "merle.wuckert@ethereal.email", // TODO - Replace with user's email after testing.
    subject: "Password recovery code from Ironclad",
    text: text,
    html: html,
  });
}
