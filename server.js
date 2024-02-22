// CREATE SERVER
const express = require("express")
const app = express()
const _PORT = process.env.PORT;
const cors = require("cors")
app.use(cors())
app.use(express.json())
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// CONNECT TO DB
const   username = process.env.USERNAME,
        password = process.env.PASSWORD,
        database = process.env.DB;
        
const mongoose = require("mongoose")
mongoose.connect(`mongodb://${username}:${password}@ac-rzjl0yz-shard-00-00.3pcivtg.mongodb.net:27017,ac-rzjl0yz-shard-00-01.3pcivtg.mongodb.net:27017,ac-rzjl0yz-shard-00-02.3pcivtg.mongodb.net:27017/${database}?replicaSet=atlas-fv2foq-shard-0&ssl=true&authSource=admin`)


// USER MODEL
const UserModel = require('./models/Users');



// get request
app.get("/users", async (req, res)=>{
    const users = await UserModel.find();
    res.json(users)
})


// create user
app.post("/createUser", async (req, res) => {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.json(req.body)
})


const AdminModel = require("./models/Admin")


//create register
app.post("/register",async(req,res)=> {

    const {username, password} = req.body
    const admin =await AdminModel.findOne({username})
    
       admin && res.json({"meassage":"admin already exists!"})
    
       const hashPassword = bcrypt.hashSync(password,10)

    
    const newAdmin = new AdminModel({
        username,
        password:hashPassword
    });
    await newAdmin.save();
    return res.json({"message":"admin created succefuly"})
})


//create login
app.post("/login",async(req,res)=>{
    const {username, password} = req.body

    const admin = await AdminModel.findOne({username})
    !admin && res.json({message:"Admin does't exists"})

    const isPasswordValid = await bcrypt.compare(password,admin.password)
    !isPasswordValid && res.json({message:"UserName or password is not correact"})

    const token = jwt.sign({id:admin._id}, process.env.SECRET )

    return res.json({token, adminID: admin._id})
})

app.listen(_PORT, ()=>{
    console.log("Server Works")
})