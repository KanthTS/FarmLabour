const exp=require('express')
const emailApp=exp.Router()
const emailModel=require('../Models/emailModel')
const nodemailer=require('nodemailer')
require('dotenv').config()
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.user,
        pass:process.env.pass
    }
})


emailApp.post('/approve', async (req, res) => {
    try {
      const { to, subject, message } = req.body;
  
      const mailOptions = {
        from: process.env.user,
        to:to,
        subject:subject,
        text: message,
      };
  
      await transporter.sendMail(mailOptions);
  
      const result = new emailModel({ to, subject, message });
      await result.save();
  
      res.status(200).json({ message: "Email sent successfully", payload: result });
    } catch (err) {
      res.status(400).json({ message: "Error", payload: err });
    }
  });
  

module.exports=emailApp;