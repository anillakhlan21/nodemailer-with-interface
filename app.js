const nodemailer = require('nodemailer');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const { getMaxListeners } = require('process');
const fs = require('fs');

const app = express();

var to;
var subject;
var body;
var path;

var Storage = multer.diskStorage({
    destination : function(req, file,callback){
        callback(null,'./images')
    },
    filename : function(req,file,callback){
        callback(null,file.filename+"_"+ Date.now()+ "_"+ file.originalname)
    }
})

var upload = multer({
    storage : Storage
}).single('image');

app.use(express.static('public')); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.sendFile('/index.html');
})
app.post('/sendemail',(req,res)=>{
    upload(req, res,function(err){
        if(err){
            console.log(err);
            return res.end("Something went wrong")
        }
        else{
             to = req.body.to;
             subject =  req.body.subject;
             body = req.body.body;
             path = req.file.path;

             const transporter = nodemailer.createTransport({
                 service: 'gmail',
                 auth:{
                     user: '',
                     pass:''
                 }
             });
             const mailOptions = {
                 from : '',
                 to,
                 subject,
                 body,
                 attachments :[
                     {
                         path

                     }
                 ]
                 
             }
             transporter.sendMail(mailOptions,(err,info)=>{
                 if(err) console.log('err');
                 console.log("Email Sent"+ info.response);
                fs.unlink(path, function(err){
                    if(err) throw err;
                    console.log("image deleted");
                    return res.redirect('/result.html');
                })
             });
        }
    })
})
app.listen(5000,(err)=>{
    if(err) throw err;
    console.log("App is running on port 5000");
});

