const crypto = require('crypto');
const { sendMail } = require('../config/mail'); 

const otps = [];
const OTP_EXPIRATION_TIME = .5 * 60 * 1000;


const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendOTP = async (to) => {
    const otp = generateOTP();
    const expiration = Date.now() + OTP_EXPIRATION_TIME;

    // Store the OTP and its expiration time
    otps.push({ email: to, otp, expiration });

    const subject = 'Your OTP Code';
    const text = `Your OTP code is: ${otp}. It is valid for 5 minutes.`;
    const html = `<h1>Your OTP Code</h1><p>Your OTP code is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`;

    try {
        await sendMail(to, subject, text, html);
        return { status: true, message: 'OTP sent successfully.' };
    } catch (error) {
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};


const verifyOTP = async (to, otp) => {
    const storedOTP = otps.find(entry => entry.email === to && entry.otp === otp);

    if (!storedOTP) {
        throw new Error('Invalid OTP or no OTP sent for this email.');
    }


    if (Date.now() > storedOTP.expiration) {
        otps.splice(otps.indexOf(storedOTP), 1); 
        throw new Error('OTP has expired.');
    }

    otps.splice(otps.indexOf(storedOTP), 1);
    return true; // OTP is valid
};

module.exports = {sendOTP,verifyOTP};
