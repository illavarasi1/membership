const express=require('express')
const mongoose=require('mongoose')
const app=express()
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
// const bodyParser = require('body-parser');
const membertypeRoutes=require('./routes/membership_type')
const membersRoutes=require('./routes/members')
const renewRoutes=require('./routes/renew')
const dashboardRoutes=require('./routes/dashboard')
const authRoutes = require('./routes/auth')
const settingsRoutes = require('./routes/settings')

const port=8000
const cors=require('cors')
app.use(bodyParser.json()); 
app.use(cors({
    origin: 'http://localhost:4200', // Allow only requests from Angular frontend
  }));
app.use(express.urlencoded({ extended: true }));
const imagePath = path.join(__dirname, 'public/images');
if (!fs.existsSync(imagePath)) {
  fs.mkdirSync(imagePath, { recursive: true });
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    res.send('helloworld')
})

app.use("/membertype",membertypeRoutes)
app.use("/members",membersRoutes)
app.use("/renew",renewRoutes)
app.use("/dashboard",dashboardRoutes)
app.use('/auth',authRoutes)
app.use('/settings',settingsRoutes)
app.use(express.static('public'));
async function connectDb(){
   await mongoose.connect('mongodb://localhost:27017',{
    dbName:'membershiphp'
},{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })
console.log("mongodb connected")
}
connectDb().catch((err)=>{
    console.error(err)
})
app.listen(port,()=>{
    console.log("port number is",port)
})