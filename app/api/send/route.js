const nodemailer = require("nodemailer");

export async function POST(request) {
  const body = await request.json();
  const { email, otp } = body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "niranjansabarinath1521@gmail.com",
        pass: "7ChzLck8HIpd36Ew",
      },
    });

    const info = await transporter.sendMail({
      from: "tamarind.house@providence.edu.in",
      to: email,
      subject: "Tamarind House OTP Verification",
      html: `<p>Your OTP for Tamarind House App is <h1>${otp}</h1></p>`,
    });

    console.log("Email sent: ", info.messageId);
    return Response.json(info);
  } catch (error) {
    console.error("Error sending email: ", error);
    return Response.json({ error });
  }
}
