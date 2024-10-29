const prisma=require('../config/dataBase');
const {sendMail}=require('../config/mail')
const { sendOTP, verifyOTP } = require('../utils/otpUtils');


const userController={
    async sendmail(req,res) {
        const {to,subject,text,html}=req.body;
        try
        {
            await sendMail(to,subject,text,html)
            res.status(200).json({status:true,message:"Email sent"})
        }
        catch(error)
        {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    async sendotp(req, res) {
        
        const { email } = req.body;
    
        if (!email) {
            return res.status(400).json({ status: false, message: 'Email is required.' });
        }
    
        try {
            const result = await sendOTP(email);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }},

        async verifyotp (req, res){

            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
            }
        
            try 
            {
                const isValid = await verifyOTP(email, otp);
                return res.status(200).json({ success: true, message: 'OTP verified successfully.', valid: isValid });
            } 
            catch (error) 
            {
                return res.status(400).json({ success: false, message: error.message });
            }
        }
}

module.exports=userController;