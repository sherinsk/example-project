const express = require('express');
const userController=require('../controllers/userController')
const {verifyUserToken}=require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/send-otp',userController.sendotp)
router.post('/verify-otp',userController.verifyotp)
router.post('/sendmail',userController.sendmail)


module.exports=router;

