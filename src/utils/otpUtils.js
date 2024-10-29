const crypto = require('crypto');
const cron = require('node-cron');
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
        throw new Error('Invalid OTP');
    }


    if (Date.now() > storedOTP.expiration) {
        otps.splice(otps.indexOf(storedOTP), 1); 
        throw new Error('OTP has expired.');
    }

    otps.splice(otps.indexOf(storedOTP), 1);
    return true; // OTP is valid
};


cron.schedule('20 20 * * *', () => {
    console.log('Cron job is running: Cleaning up expired OTPs.');

    const currentTime = Date.now();
    const initialLength = otps.length; // Length before cleanup

    // Remove expired OTPs
    for (let i = otps.length - 1; i >= 0; i--) {
        if (otps[i].expiration < currentTime) {
            otps.splice(i, 1);
        }
    }

    const removedCount = initialLength - otps.length; // Number of removed OTPs
    if (removedCount > 0) {
        console.log(`Removed ${removedCount} expired OTP(s)`);
    } else {
        console.log('No expired OTPs to remove.');
    }
});

module.exports = {sendOTP,verifyOTP};
