import nodemailer from 'nodemailer';
import { google } from 'googleapis';

// const {
//   GOOGLE_CLIENT_ID,
//   GOOGLE_CLIENT_SECRET,
//   GOOGLE_REFRESH_TOKEN,
//   EMAIL_SENDER_ADDRESS,  
// } = process.env;
const EMAIL_SENDER_ADDRESS = "node4676@gmail.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_CLIENT_ID = "650453850445-jcs4qjfj6qglo1pfvc2s5ibva062mfh8.apps.googleusercontent.com";
const GOOGLE_REFRESH_TOKEN = "1//04HdHeeSXqnS9CgYIARAAGAQSNwF-L9Irt1P9bO2kU8Tzea4nkKgyFm_h3Vp1wMGeY87lhpRl83svcua2wcpqnoXrrsA2WbUSBKI"

console.log(EMAIL_SENDER_ADDRESS, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN);

// Setup OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

/**
 * Send contact notification email
 * @param {string} toEmail - Recipient email
 * @param {Object} sender - Sender info { name, email, phone, role, location }
 * @param {Object} [contract] - Optional contract info { cropType, quantity, price, location, unit }
 */
const sendContactNotificationEmail = async (toEmail, sender, contract = null) => {
  try {
    const accessToken = (await oAuth2Client.getAccessToken()).token;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_SENDER_ADDRESS,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
      tls: { rejectUnauthorized: true }
    });

    const mailOptions = {
      from: `"Fram2Factory" <${EMAIL_SENDER_ADDRESS}>`,
      to: toEmail,
      subject: `📩 New Contact Request from ${sender.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background: #fafafa;">
          <h2 style="color: #333; text-align: center;">New Contact Request</h2>
          <p style="font-size: 16px; color: #555;">
            You have received a new contact request from <strong>${sender.name}</strong> (${sender.role || 'User'}).
          </p>

          <h3 style="color: #2c7a2d; margin-top: 20px;">📞 Contact Info</h3>
          <p style="font-size: 14px; color: #555;">
            Email: ${sender.email} <br>
            Phone: ${sender.phone || 'N/A'} <br>
            Location: ${sender.location || 'N/A'}
          </p>

          ${
            contract
              ? `<h3 style="color: #2c7a2d; margin-top: 20px;">🌾 Contract Details</h3>
                 <p style="font-size: 14px; color: #555;">
                   Crop Type: ${contract.cropType || 'N/A'} <br>
                   Quantity: ${contract.quantity || 'N/A'} ${contract.unit || ''} <br>
                   Price: ₹${contract.price || 'N/A'} per unit <br>
                   Delivery Location: ${contract.location || 'N/A'}
                 </p>`
              : ''
          }

          <p style="font-size: 14px; color: #999; margin-top: 20px;">
            Please get in touch with the sender to finalize the details.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            © ${new Date().getFullYear()} Fram2Factory. All rights reserved.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Contact email sent:", result.response);
    return result;

  } catch (err) {
    console.error('Failed to send contact email:', err.message);
    throw new Error('Failed to send contact notification email');
  }
};

export default sendContactNotificationEmail;
