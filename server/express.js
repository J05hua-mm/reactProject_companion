import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cors from 'cors';
import passport from "passport";
import LocalStrategy from "passport-local";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import logger from "morgan";
import session from "express-session"
import bcrypt from "bcrypt";
import {validation,validation2,isEmpty,isValidEmail,dataKeymatch} from "./validations.js";

const app = express();
const port = 4000;
const saltrounds = process.env.SALTROUNDS;
const dbconnect = process.env.DATABASE_URL;
const secret_key = process.env.SECRET_KEY;


async function databaseConnect() {
    mongoose.connect(dbconnect);
    console.log("connected to database");
}
databaseConnect();

const userschema = mongoose.Schema({username:String,password:String,email:String});
const User = mongoose.model('User',userschema,'users');
const topicschema = new mongoose.Schema(
    {
        userid:String,
        description:String,
        topicname:String,
        creationdate:Date,
        estimatedenddate:Date,
        no_of_tasks:Number,
        no_of_notes:Number,
        no_of_hours:Number,
    }
   );
const Topic = mongoose.model('Topic',topicschema,'topics');

const taskschema = new mongoose.Schema({
    userid:String,
    topicId:String,
    taskname:String,
    isChecked:Boolean,
   });

const Task = mongoose.model('Task',taskschema,"tasks");

const cardschema = new mongoose.Schema({
    userid:String,
    topicId:String,
    cardnum:String,
    cardname:String,
    description:String,
    isdeleted:Boolean,
    links:Array
   });

const Card = mongoose.model('Card',cardschema,'cards');

const timerschema = new mongoose.Schema({
    userid:String,
    topicid:String,
    state:String,
    Lasrtime:Number,
    differenceTime:Number,
});

const Timer = mongoose.model('Timer',timerschema,'timers');

function hourscalculate(miliseconds) {
    const hours = miliseconds/(1000 * 60 * 60);
    return hours;
}

function miisecondscalculate(hours) {
    const miliseconds = hours * 60 * 60 * 1000;
    return miliseconds;
}


passport.use(new LocalStrategy(async function verify(username,password,cb) {
   
    try {
        const user = await User.findOne({email:username});
        if(!user) {
            return cb(null,false,{message:"Incorrect username"});
        }
       
        const match = await bcrypt.compare(password,user.password);
        if(!match) {
            return cb(null,false,{message:"Incorrect password"});
        }

        return cb(null,user);
    }
    catch(err) {
    return cb(err); 
    }
   
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, user._id); 
    });
  });
  
  passport.deserializeUser(async function(userid, cb) {
    try {
      const foundUser = await User.findById(userid); 
      cb(null, foundUser); 
    } catch (err) {
      cb(err);
    }
  });
  


app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    secret:secret_key,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24,
        sameSite:"lax",
        secure:false,
    },
    store:MongoStore.create({mongoUrl:dbconnect})
}));
app.use(passport.authenticate('session'));

app.post("/login",(req,res,next) => {

    const assignedData = ["username","password"];
    const clientdata = req.body;

    const validation1 = dataKeymatch(assignedData,clientdata);
    if(!validation1) {
      return res.status(400).json({type:"login",sucess:false,message:"Malformed request data"});
    }
    
    const emailvalidation = validation(clientdata.username.trim(),2,100,"string");
    const emailvalidation2 = isValidEmail(clientdata.username.trim());
    if(!emailvalidation.passed) {
        return res.status(400).json({type:"login",sucess:false,message:emailvalidation.message});
    }
    
    if(!emailvalidation2) {
        return res.status(400).json({type:"login",sucess:false,message:"Invalid e-mail format"});
    }

    const passwordvalidation = validation(clientdata.password.trim(),8,20,"string");
    if(!passwordvalidation.passed) {
        return res.status(400).json({type:"login",sucess:false,message:passwordvalidation.message});
    }

    passport.authenticate("local",(err,user,info) => {
        if(err) return next(err);
        if(!user) {
            return res.status(401).json({type:"login",sucess:false,message:"Invalid credentials"});
        }

        req.login(user, function(err) {
            if (err) return next(err);
            return res.json({ type:"login",success: true, message: "Logged in successfully", user });
          });

    })(req,res,next);
    
});

app.post("/signup",async (req,res,next) => {

    const assignedData = ['email','username','password','confirmPassword','type'];
    const clientdata = req.body;

    const validation1 = dataKeymatch(assignedData,clientdata);
   if(!validation1) {
     return res.status(400).json({type:"signup",sucess:false,message:"Malformed request data"});
   }
   

   const emailvalidation = validation(clientdata.email.trim(),2,100,"string");
   const emailvalidation2 = isValidEmail(clientdata.email.trim());
   if(!emailvalidation.passed) {
       return res.status(400).json({type:"signup",sucess:false,message:emailvalidation.message});
   }

   if(!emailvalidation2) {
    return res.status(400).json({type:"signup",sucess:false,message:"Invalid e-mail format"});
   }


   try {
    const response = await User.findOne({email:clientdata.email.trim()});
    if(response) {
        return res.status(400).json({type:"signup",sucess:false,message:"email already exists"});
    } 
   }
   catch(err) {
    console.log(err);
   }
 
   const usernameValidation = validation(clientdata.username.trim(),5,20,"string");
   if(!usernameValidation.passed) {
    return res.status(400).json({type:"signup",sucess:false,message:usernameValidation.message});
   } 

   if(clientdata.password.trim() === clientdata.confirmPassword.trim()) {
    const passwordValidation = validation(clientdata.password.trim(),8,20,"string");
    if(!passwordValidation.passed) {
        return res.status(400).json({type:"signup",sucess:false,message:passwordValidation.message});
    }
   }
   else {
    return res.status(400).json({type:"signup",sucess:false,message:"password doesn't match"});
   }
 

    bcrypt.hash(req.body.password,saltrounds,async function(err,hash) {
        if(err) {return next(err)};
       const newuser = new User({username:req.body.username,password:hash,email:req.body.email});
       try {
        const response = await newuser.save();
        var user = {
            userid:response._id,
            username:req.body.username,
            email:req.body.email
        };
        req.login(response,(err) => {
            if(err) {return next(err)};
            return res.json({ type:"signup",success: true, message:"Logged in successfully", user:user });
        })
       } catch(err) {
        return res.status(401);
       }
    });

});

app.get("/sessionactive",(req,res) => {

    try {
    if(req.isAuthenticated()) {
        return res.json({loggedin:true,user:req.user.username});
    }
    else {
        return res.json({loggedin:false});
    }
} catch(err) {
    return res.sendStatus(401);
}

})

app.post("/logout",(req,res,next) => {
    
    req.logout(function(err) {

        if(err) {
            return next(err);
        }

        req.session.destroy((err) => {
            if(err) {
                return next(err);
            }
            res.clearCookie("connect.sid");
            return res.sendStatus(200);
        })
    })

})

app.get("/topics",async (req,res) => {
    try {
        const data = await Topic.find({userid:req.user._id},'topicname creationdate');
        return res.send(data);
    }
    catch(err) {
        return res.status(401);
    }
})

app.post("/newtopic",async (req,res) => {
    const clientdata = req.body;
    const assignedData = ['topicname','topicdescription','Doc','Eed'];

     const validation1 = dataKeymatch(assignedData,clientdata);
    if(!validation1) {
      return res.status(400).json({sucess:false,message:"Malformed request data"});
    }

    const topicnameValidation = validation(clientdata.topicname.trim(),2,30,'string');
     if(!topicnameValidation.passed) {
        return res.status(400).json({sucess:false,message:topicnameValidation.message});
     }

    const topicdescriptionValidation = validation(clientdata.topicdescription.trim(),10,200,"string");
    if(!topicdescriptionValidation.passed) {
        return res.status(400).json({sucess:false,message:topicdescriptionValidation.message});
     }

    const DocValidation = validation(clientdata.Doc.trim(),5,30,'string');
    if(!DocValidation.passed) {
        return res.status(400).json({sucess:false,message:DocValidation.message});
     }

    const Eedvalidation = validation(clientdata.Eed.trim(),5,30,'string');
    if(!Eedvalidation.passed) {
        return res.status(400).json({sucess:false,message:Eedvalidation.message});
     }

  try {
    const topic = new Topic({
        userid:req.user._id,
        description:clientdata.topicdescription,
        topicname:clientdata.topicname,
        creationdate:new Date(clientdata.Doc),
        estimatedenddate:new Date(clientdata.Eed),
        no_of_tasks:0,
        no_of_notes:0,
        no_of_hours:0
    })
    await topic.save();
    return res.sendStatus(200);
  }
  catch(err) {
    return res.sendStatus(401);
  }
});

app.get("/topics/:id/overview",async (req,res) => {

    const id = req.params.id;

   try {
    const data = await Topic.findOne({userid:req.user._id,_id:new mongoose.Types.ObjectId(id)});
    return res.send(data);
   } catch(err) {
    return res.sendStatus(401);
   }
})

app.post("/:topicid/overview", async (req,res) => {
    const clientdata = req.body;
    const param = req.params.topicid;

    const typeValidation = validation(clientdata.type.trim(),7,30,"string");
    if(!typeValidation.passed) {
        return res.send(400).json({sucess:false,message:"Malformed request data"});
    }


    if(clientdata.type === "topicname") {

        const assignedData = ["type","topicname"];
        const validation1 = dataKeymatch(assignedData,clientdata);
        if(!validation1) {
            return res.status(400).json({sucess:false,message:"Malformed request data"});
        }

        const topicnameValidation = validation(clientdata.topicname.trim(),2,20,'string');
        if(!topicnameValidation.passed) {
           return res.status(400).json({sucess:false,message:topicnameValidation.message});
        }

        try {
            const respnse = await Topic.updateOne({userid:req.user._id,_id:new mongoose.Types.ObjectId(param)},{topicname:clientdata.topicname.trim()});
            return res.sendStatus(200);
        }
        catch (err) {
            return res.sendStatus(401);
    } }
    else if(clientdata.type === "topicdescription") {
        
        const assignedData = ["type","topicdescription"];
        const validation1 = dataKeymatch(assignedData,clientdata);
        if(!validation1) {
            return res.status(400).json({sucess:false,message:"Malformed request data"});
        }

        const topicdescriptionValidation = validation(clientdata.topicdescription.trim(),10,200,"string");
        if(!topicdescriptionValidation.passed) {
            return res.status(400).json({sucess:false,message:topicdescriptionValidation.message});
         }

        try {
            const respnse = await Topic.updateOne({userid:req.user._id,_id:new mongoose.Types.ObjectId(param)},{description:clientdata.topicdescription.trim()});
            return res.sendStatus(200);
        }
        catch (err) {
            return res.sendStatus(401);
    }
}
    else if(clientdata.type === "estimatedate") {

        const assignedData = ["type","estimatedate"];
        const validation1 = dataKeymatch(assignedData,clientdata);
        if(!validation1) {
            return res.status(400).json({sucess:false,message:"Malformed request data"});
        }

        const Eedvalidation = validation(clientdata.estimatedate.trim(),5,30,'string');
        if(!Eedvalidation.passed) {
            return res.status(400).json({sucess:false,message:Eedvalidation.message});
         }

        try {
            const respnse = await Topic.updateOne({userid:req.user._id,_id:new mongoose.Types.ObjectId(param)},{estimatedenddate:clientdata.estimatedate.trim()});
            return res.sendStatus(200);
        }
        catch (err) {
            return res.sendStatus(401);
    }
}
})


app.get("/topics/:topicid/tasks",async (req,res) => {
    
    const param = req.params.topicid;

    try {
        const response = await Task.find({userid:req.user._id,topicId:param});
        return res.send(response);
    }
    catch(err) {
        return res.sendStatus(401);
    }
})

app.post("/:topicid/newtask", async (req,res) => {

const clientdata = req.body;
const param = req.params.topicid;
const assignedata = ["taskname","type"];


const validation1 = dataKeymatch(assignedata,clientdata);
if(!validation1) {
return res.status(400).json({sucess:false,message:"Malformed request data"});
}

const typevalidation = validation(clientdata.type.trim(),5,30,"string");
if(!typevalidation.passed) {
    return res.status(400).json({sucess:false,message:typevalidation.message});
}

const taskvalidation = validation(clientdata.taskname.trim(),2,100,"string");
if(!taskvalidation.passed) {
    return res.status(400).json({sucess:false,message:taskvalidation.message});
}

try {
    const task = new Task({    
    userid:req.user._id,
    topicId:param,
    taskname:clientdata.taskname.trim(),
    isChecked:false,
    })
    const response = await task.save(); 
    const taskno = await Task.find({userid:req.user._id,topicId:param});
    const topictaskupdate = await Topic.updateOne({userid:req.user._id,_id:new mongoose.Types.ObjectId(param)},{no_of_tasks:taskno.length});
    
    return sendStatus(200);
}
catch(err) {
    res.sendStatus(401);
}

})

app.post("/:topicid/task/:taskid/checked", async (req,res) => {

  const clientdata = req.body;
  const topicid = req.params.topicid;
  const taskid = req.params.taskid;
  const assignedata = ["type","id","editedtask"];

  const validation1 = dataKeymatch(assignedata,clientdata);
  if(!validation1) {
    return res.status(400).json({sucess:false,message:"Malformed request data"});
  }

  const typevalidation = validation(clientdata.type.trim(),5,30,'string');
  if(!typevalidation.passed) {
    return res.status(400).json({sucess:false,message:typevalidation.message});
  }

  try {
  const response = await Task.updateOne({userid:req.user._id,topicId:topicid,_id:new mongoose.Types.ObjectId(taskid)},{isChecked:true});
  return res.sendStatus(200);
  }
  catch(err) {
   return res.sendStatus(401);
  }

});

app.post("/:topicid/task/:taskid/edit", async (req,res) => {

const clientdata = req.body;
const topicid = req.params.topicid;
const taskid = req.params.taskid;

const assignedata = ["type","id","editedtask"];

const validation1 = dataKeymatch(assignedata,clientdata);
if(!validation1) {
  return res.status(400).json({sucess:false,message:"Malformed request data"});
}

const typevalidation = validation(clientdata.type.trim(),5,30,'string');
if(!typevalidation.passed) {
  return res.status(400).json({sucess:false,message:typevalidation.message});
}

const editvalidation = validation(clientdata.editedtask.trim(),2,100,'string');
if(!editvalidation.passed) {
    return res.status(400).json({sucess:false,message:editvalidation.message});
}

try {
const response = await Task.updateOne({userid:req.user._id,topicId:topicid,_id:new mongoose.Types.ObjectId(taskid)},{taskname:clientdata.editedtask.trim()});
return res.sendStatus(200);
}
catch(err) {
return res.sendStatus(401);
}
});

app.post("/:topicid/task/:taskid/delete", async (req,res) => {

const topicid = req.params.topicid;
const taskid = req.params.taskid;

try {
const response = await Task.deleteOne({userid:req.user._id,topicId:topicid,_id:new mongoose.Types.ObjectId(taskid)});
return res.sendStatus(200);
}
catch(err) {
res.sendStatus(401);
}
})

app.get("/topics/:topicid/card", async (req,res) => {

    const topicid = req.params.topicid;

    try {
        const response = await Card.find({userid:req.user._id,topicId:topicid});
        return res.send(response);
    }
    catch(err) {
        res.sendStatus(401);
    }
})

app.post("/:topicid/newcard", async (req,res) => {

    const clientdata = req.body;
    const arr = req.body.cardslist.split(',');
    const param = req.params;
    const assignedata = ['cardnum','cardname','comment','cardslist','type'];

    const validation1 = dataKeymatch(assignedata,clientdata);
   if(!validation1) {
    return res.status(400).json({sucess:false,message:"Malformed request data"});
   }

   const cardnumvalidation = validation(clientdata.cardnum.trim(),2,20,'string');
   if(!cardnumvalidation.passed) {
    return res.status(400).json({sucess:false,message:cardnumvalidation.message});
   }

   const cardnamevalidation = validation(clientdata.cardname.trim(),2,100,'string');
   if(!cardnamevalidation.passed) {
    return res.status(400).json({sucess:false,message:cardnumvalidation.message});
   }
     
   const commentvalidation = validation(clientdata.comment.trim(),2,2000,'string');
   if(!commentvalidation.passed) {
    return res.status(400).json({sucess:false,message:commentvalidation.message});
   }

   const cardlistvalidation = validation2(clientdata.cardslist.trim(),0,300,'string');
   if(!cardlistvalidation.passed) {
    return res.status(400).json({sucess:false,message:cardlistvalidation.message});
   }

   const typevalidation = validation(clientdata.type.trim(),2,30,'string');
   if(!typevalidation.passed) {
    return res.status(400).json({sucess:false,message:typevalidation.message});
   }

    try {
        const card = new Card({
            userid:req.user._id,
            topicId:param.topicid,
            cardnum:clientdata.cardnum.trim(),
            cardname:clientdata.cardname.trim(),
            description:clientdata.comment.trim(),
            isdeleted:false,
            links:arr
        })
   const response = await card.save(); 
   const topicCard = await Card.find({userid:req.user._id,topicId:param.topicid});
   const topictaskupdate = await Topic.updateOne({userid:req.user._id,_id:new mongoose.Types.ObjectId(param.topicid)},{no_of_notes:topicCard.length});
  
   return res.sendStatus(200);
    }
    catch(err) {
        console.log(err);
        res.sendStatus(401);
    }
    
});

app.post("/:topicid/cards/:cardid/edit", async (req,res) => {

    const clientdata = req.body;
    const assignedata = ["editedcardname","id","editedcardesc","type"];
    const param = req.params;
    const topicid = param.topicid;
    const cardid = param.cardid;
    
    const validation1 = dataKeymatch(assignedata,clientdata);
    if(!validation1) {
        return res.status(400).json({sucess:false,message:"Malformed request data"});
    }

    const cardnamevalidation = validation(clientdata.editedcardname.trim(),2,100,'string');
   if(!cardnamevalidation.passed) {
    return res.status(400).json({sucess:false,message:cardnamevalidation.message});
   }

    const typevalidation = validation(clientdata.type.trim(),2,30,'string');
   if(!typevalidation.passed) {
    return res.status(400).json({sucess:false,message:typevalidation.message});
   }

   const commentvalidation = validation(clientdata.editedcardesc.trim(),2,2000,'string');
   if(!commentvalidation.passed) {
    return res.status(400).json({sucess:false,message:commentvalidation.message});
   }


    try {
     const response = await Card.updateOne({userid:req.user._id,topicId:topicid,_id:new mongoose.Types.ObjectId(cardid)},{cardname:clientdata.editedcardname.trim(),description:clientdata.editedcardesc.trim()});
     return res.sendStatus(200);
    }
    catch(err) {
     return res.sendStatus(401);
    }

});

app.post("/:topicid/cards/:cardid/delete", async (req,res) => {

    const data = req.body;
    const param = req.params;
    const topicid = param.topicid;
    const cardid = param.cardid;
    const userid = req.user.username;

    try {
        const response = await Card.updateOne({userid:req.user._id,topicId:topicid,_id:new mongoose.Types.ObjectId(cardid)},{isdeleted:true});
        return res.sendStatus(200);
       }
       catch(err) {
        return res.sendStatus(401);
       }

})

app.post('/timerverify',async (req,res) => {

        const assignedata = ["pathname"];
        const clientdata = req.body;

    
        const validation1 = dataKeymatch(assignedata,clientdata);
        if(!validation1) {
            return res.status(400).json({sucess:false,message:"Malformed request data"});
        }
    
        const pathverify = (arr) => {
            if(arr.length >= 3) {
               if(arr[1] === "topics") {
                return true;
               }
            }
            return false;
          }

        const pathverifier = pathverify(clientdata.pathname);

        if(pathverifier) {
            return res.status(200).json({sucess:true,message:"recived good data"});
        }

});


app.post("/timerdata", async (req,res) => {

    const clientdata = req.body;
    const assignedata = ["data"];
    const assignedata2 = ["isActive","state","time","topicid"];
    
    const validation1 = dataKeymatch(assignedata,clientdata);
    if(!validation1) {
        return res.status(400).json({sucess:false,message:"Malformed data request"});
    }   

    const validation2 = dataKeymatch(assignedata2,clientdata.data);
    if(!validation2) {
        return res.status(400).json({sucess:false,message:"Malformed data request"});
    } 

   try {
      const response = await Timer.findOne({topicid:clientdata.data.topicid.trim()});
      if(!response) {
        const timer = new Timer({
            userid:req.user._id,
            topicid:clientdata.data.topicid.trim(),
            state:clientdata.data.state.trim(),
            Lasrtime:clientdata.data.time,
            differenceTime:0,
        });
        const response = await timer.save();
        return res.status(200);
      }
      else if(response) {
        const currentstate = response.state.trim();
        const currenttime = response.Lasrtime;

        if(currentstate === "play") {
           const differencetime = response.differenceTime + (clientdata.data.time - response.Lasrtime);
           const updationstate = clientdata.data.state;
           const updationTime = clientdata.data.time;
            
           
        const result = await Timer.updateOne({userid:req.user._id,topicid:clientdata.data.topicid.trim()},{state:updationstate,Lasrtime:updationTime,differenceTime:differencetime});
        const topictime = await Topic.updateOne({userid:req.user._id,_id:new mongoose.Types.ObjectId(clientdata.data.topicid)},{no_of_hours:hourscalculate(differencetime)});
          
        }
        else if(currentstate === "pause") {
    
           const updationstate = clientdata.data.state;
           const updationTime = clientdata.data.time;

           const result = await Timer.updateOne({userid:req.user._id,topicid:clientdata.data.topicid.trim()},{state:updationstate,Lasrtime:updationTime});
          
        }
        else if(currentstate === "reset") {
      
            const updationstate = clientdata.data.state;
            const updationTime = clientdata.data.time;
 
            const result = await Timer.updateOne({userid:req.user._id,topicid:clientdata.data.topicid.trim()},{state:updationstate,Lasrtime:updationTime});
           
        }    
    }
   }
   catch(err) {
    return res.status(401);
   }
})

app.listen(port, () => {
    console.log('express is listening');
});