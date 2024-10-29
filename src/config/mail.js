const nodemailer = require('nodemailer');


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host:"smtp.gmail.com" ,
  port: 465,
  secure: 'true', // true for 465, false for other ports
  auth: {
    user: "sherinsk.backenddev@gmail.com",
    pass: "nqqv kfub pdtm gqel",
  },
});

const sendMail = async (to, subject, text, html) => {

    const mailOptions = 
    {
        from: process.env.MAIL_FROM,
        to,
        subject,
        ...(text && { text }), // Only add text if it is provided
        ...(html && { html }), // Only add html if it is provided
    };

  try 
  {
    const info = await transporter.sendMail(mailOptions);
    return { status: true, message: `Email sent to ${to}` };
  } 
  catch (error) 
  {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error(`Failed to send email to ${to}: ${error.message}`); // Throw an error
  }
};


// Export the sendMail function for use in other modules
module.exports = { sendMail };
