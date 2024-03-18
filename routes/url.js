const express=require('express')
const {handleGenerateNewShortURL,handleGetAnaltics}=require('../controllers/url')
const router=express.Router();

router.post('/',handleGenerateNewShortURL)

router.get('/analytics/:shortId',handleGetAnaltics)

module.exports=router;