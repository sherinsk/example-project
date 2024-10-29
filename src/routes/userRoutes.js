const express = require('express');
const userController=require('../controllers/userController')
const {verifyUserToken}=require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/check',verifyUserToken,userController.checkApi)


module.exports=router;

