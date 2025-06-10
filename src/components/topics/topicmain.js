import Topics from "./topic.js";
import axios from "axios";
import { useState,useEffect } from "react";
import {Form,redirect,useLoaderData,useNavigation,useRevalidator} from "react-router-dom";

export async function topicLoader() {
    
    try {
        const response = await axios.get("http://localhost:4000/topics",{withCredentials:true});
        return response.data;
    }
    catch (err) {
        console.log(err);
    return err;
    }
}

export async function newtopicAction({params,request}) {

    const formdata = await request.formData();
    const data = Object.fromEntries(formdata.entries());
    
    try {
        const response = await axios.post("http://localhost:4000/newtopic",data,{
            withCredentials:true,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
        return response;
    }
    catch(err) {
        return err;
    }
}


export default function Topicmain() {

    const [newTopic,setnewtopic] = useState(false);
    const data = useLoaderData();
    const revalidator = useRevalidator();
    const navigation = useNavigation();
    const date = String(new Date().getFullYear()) + '-' + String((new Date().getMonth() + 1)).padStart(2,"0") + '-' + String(new Date().getDate()).padStart(2,'0');
 
   useEffect(() => {
    if(navigation.state === "idle") {
        setnewtopic(false);
    }
   },[navigation.state]);

   
    return (
     <div className="Topicmain">
      
     <div className="Topicmain-btn">
        <button onClick={() => setnewtopic(!newTopic)}>create new topic</button>
     </div>

    {
        (newTopic ? <div className="Topicmain-newtopic">
            
            <div className ='new-topic'>

<Form method="post"> 
   
 <div className="newtopic-name">
 <span>topicname*</span>
 <input name="topicname" minLength={2} maxLength={20} required placeholder="topic name"></input>
 </div>

 <div className="newtopic-description">
  <span>description*</span>
  <textarea name="topicdescription" minLength={10} maxLength={200} required placeholder="type something about topic . . ."></textarea>
 </div>

<div className="newtopic-date">

<div className="newtopic-creation-date">
  <span>start date*</span>
  <input name="Doc" type="date" defaultValue={date} min={date} max={date}></input>
 </div>

 <div className="newtopic-estimated-end-date">
 <span>end date*</span>
 <input name="Eed" type="date" min={date}></input>
 </div>

</div>
 

 <div className="newtopic-btns">
  <button className="newtopic-btns-btn" type="submit">create</button>
  <button className="newtopic-btns-btn" type="button" onClick={() => setnewtopic(false)}>cancel</button>
 </div>

 </Form>
</div>

      
    </div> : null)
    }    

    {/* <h1>{navigation.state === "submitting"?"hello":"goodbye"}</h1> */}

     <div className="Topicsection">

        <div className="topicsection-div">
        {
            data.map((item,index) => {
              return <Topics topicname={item.topicname} creationdate={item.creationdate} key={item._id} no={index} id={item._id}/>
            })
        }
     </div>
     </div>
    

     </div>
    )
}