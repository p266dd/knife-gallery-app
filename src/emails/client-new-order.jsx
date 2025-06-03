import { mailer } from "./mailer";

export async function ClientNewOrderEmail({ name, email, orderDetails }) {
  const text = `
    Hello ${name},\n\n
    We have successfully received your order.\n
    -- Message goes here. --\n\n
    If you have any questions, or want to discuss about this order, please contact us at staff@ironcladknives.com.\n\n\n
  
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
          <h2 style="font-size: 22px; margin-bottom: 30px; ">New Order Received</h2>
          <p>Hello ${name}, we have successfully received your order.<br />
            -- Message goes here. --<br /><br />
           If you have any questions, or want to discuss about this order, please contact us at staff@ironcladknives.com.
          </p>
          <br /><br /><br />
          <p class="footer">Best, <br> Ironclad</p>
        </div>
      </body>
    </html>
  `;

  return await mailer.sendMail({
    from: `'Ironclad' <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "New Order Received",
    text: text,
    html: html,
  });
}
