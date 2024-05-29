
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyparser = require('body-parser')
const nodemailer = require('nodemailer')

const students = require('./models/Students')
require('./dbConnect')

const encoder = bodyparser.urlencoded()
const transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      auth:{
        user:'salmanalvi123441512@gmail.com',
        pass:"dnfohzjiahemmqte"
      }
})

const  app = express()
app.use(express.static(path.join(__dirname,'views/public')))
app.set("view engine","hbs")

hbs.registerPartials(path.join(__dirname,'views/partials'))

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/home',(req,res)=>{
    res.render('home')
})

app.get('/about',(req,res)=>{
    res.render('About')
})

app.get('/blog-single',(req,res)=>{
    res.render('blog-single')
})

app.get('/blog',(req,res)=>{
    res.render('blog')
})

app.get('/contact',(req,res)=>{
    res.render('contact',{show:false})
})

app.get('/course-single',(req,res)=>{
    res.render('course-single')
})

app.get('/courses',(req,res)=>{
    res.render('courses')
})
app.get('/event-single',(req,res)=>{
    res.render('event-single')
})

app.get('/events',(req,res)=>{
    res.render('events')
})

app.get('/notice-single',(req,res)=>{
    res.render('notice-single')
})

app.get('/notice',(req,res)=>{
    res.render('notice')
})

app.get('/research',(req,res)=>{
    res.render('research')
})

app.get('/scholarship',(req,res)=>{
    res.render('scholarship')
})

app.get('/teacher-single',(req,res)=>{
    res.render('teacher-single')
})

app.get('/teacher',(req,res)=>{
    res.render('teacher')
})

app.post('/contact', encoder,async (req, res) => {
    
    try{
        res.render('contact')
        
        let data = new students(req.body)
       await  data.save()
    //    res.redirect('/Home')

        //  This is for send mail 
        let mailOptions = {
            from: "salmanalvi123441512@gmail.com",
            to: req.body.mail, // Use the email address provided in the request body
            subject: req.body.subject || 'Query Received',
            html: `
                <h2>Thanks! For Registration</h2>
                
                <h3>Plaese Check Your Details</h3>
                <table>
                <tr>
                <td> Name :</td><td> ${req.body.name} </td></tr>
                <tr><td> Email :</td><td> ${req.body.mail} </td></tr>
               <tr> <td> Phone :</td> <td> ${req.body.phone} </td></tr>
               
                </table>
            `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending email');
            }
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        });
    
        mailOptions = {
            from: "salmanalvi123441512@gmail.com",
            to: "salmanalvi123441512@gmail.com", // Use the email address provided in the request body
            subject: ' New Query Received',
            html: `
                <h2>New Query Received</h2>
                <h3>Name : </h3>  ${req.body.name}
                <h3>Email : </h3> ${req.body.mail}
                <h3>Phone No. : </h3> ${req.body.phone}
                <h3>Subject  :</h3> ${req.body.subject}
                <h3>Message   :</h3> ${ req.body.message}
            `
        };
        // Send the email using Nodemailer transporter
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                
            }
            console.log('Email sent:', info.response);
            
        });
    }
    catch(error){
        console.log(error)
    }
    
});

app.get('/studentsReacord',async (req,res)=>{
   try{
    let data = await students.find().sort({_id:1})
     res.render('studentsReacord',{data:data})
   }
   catch(error){
     console.log(error)
   }
})  

app.get('/delete/:_id',async (req,res)=>{
    try{
       let data = await students.findOne({_id:req.params._id})
        await data.deleteOne()
       
       res.redirect('/studentsReacord')
    }
    catch(error){
        console.log(error)
    }
});
app.get('/edit/:_id',async (req,res)=>{
    try{
       let data = await students.findOne({_id:req.params._id})
         res.render("edit",{data:data})
    }
    catch(error){
        console.log(error)
    }
});
app.post('/edit/:_id',encoder,async (req,res)=>{
    try{
       await students.updateOne({_id:req.params._id},req.body)
         res.redirect('/studentsReacord')
    }
    catch(error){
        console.log(error)
    }
});

app.get('/search', async(req,res)=>{
    try{
     let search = req.query.search;
     let data = await students.find({
        $or:[
             {name:{$regex:`/*${search}/*`,$options:"i"}},
             {mail:{$regex:`/*${search}/*`,$options:"i"}},
             {phone:{$regex:`/*${search}/*`,$options:"i"}}

        ]
     })
     res.render('studentsReacord',{data:data})
    }
    catch(error){
        console.log(error)
    }

})

app.listen(8000,console.log("Server Runing at port Number  http://localhost:8000"))