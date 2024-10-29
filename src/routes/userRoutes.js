const express = require('express');
const userController=require('../controllers/userController')

const router = express.Router();

router.post('/check',userController.checkApi)


module.exports=router;
