import { mailer } from "./mailer";

export async function StaffNewOrderEmail({ name, email, orderDetails }) {
  const text = `
    New order from ${name},\n\n
    -- Message goes here. --\n\n\n
  
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
          <h2 style="font-size: 22px; margin-bottom: 30px; ">New Order</h2>
          <p>New Order from ${name}.<br />
            -- Message goes here. --<br /><br />
          </p>
          <br /><br /><br />
          <p class="footer">Best, <br> Ironclad</p>
        </div>
      </body>
    </html>
  `;

  return await mailer.sendMail({
    from: `'Ironclad' <${process.env.NODEMAILER_USER}>`,
    to: "Ironclad <staff@ironcladknives.com>",
    subject: "New Order",
    text: text,
    html: html,
  });
}
