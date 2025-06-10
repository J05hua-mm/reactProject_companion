import Tasks from './tasks.js';
import { useState,useEffect } from 'react';
import {Form,redirect,useLoaderData,useRevalidator,useNavigation} from "react-router-dom";
import axios from "axios";

export async function taskLoader({params,request}) {

    const param = params.topicid;
    console.log(param);

    try {
        const response = await axios.get(`http://localhost:4000/topics/${param}/tasks`,{withCredentials:true});
        return response.data;
    }
    catch(err) {
    return err;
    }
}


export async function taskAction({params,request}) {

    const formdata = await request.formData();
    const data = Object.fromEntries(formdata.entries());
    const param = params.topicid;
    const taskid = data.id;

    if(data.type === "newtask") {

    try {
        const response = await axios.post(`http://localhost:4000/${param}/newtask`,data,{
            withCredentials:true,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
        return redirect(`http://localhost:3000/topics/${param}/tasks`);
    }
    catch(err) {
        return(err);
    }

}  else if(data.type === "checked") {
    
   try {
        const response = await axios.post(`http://localhost:4000/${param}/task/${taskid}/checked`,data,{
            withCredentials:true,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
        return redirect(`http://localhost:3000/topics/${param}/tasks`);
    }
    catch(err) {
        return(err);
    }

} else if( data.type === "editedtask") {

    try {
        const response = await axios.post(`http://localhost:4000/${param}/task/${taskid}/edit`,data,{
            withCredentials:true,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
        return redirect(`http://localhost:3000/topics/${param}/tasks`);
    }
    catch(err) {
        return(err);
    }

} else if(data.type === "delete") {

    try {
        const response = await axios.post(`http://localhost:4000/${param}/task/${taskid}/delete`,data,{
            withCredentials:true,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
        return redirect(`http://localhost:3000/topics/${param}/tasks`);
    }
    catch(err) {
        return(err);
    }

}

}

export default function Taskbar() {

    const taskname = useLoaderData();
    const [isClicked,setisClicked] = useState(false);
    const [task,setTask] = useState('');
    const navigate = useNavigation();
    const revalidator = useRevalidator();

    useEffect(() => {
             if(navigate.state === "idle") {
                setisClicked(false);
                setTask('');
             }
    },[navigate.state]);

    return(
        <div className='taskbar'>

            <div className='newtask-btn'>
            <button onClick={() => setisClicked(true)}>create new task</button>
            </div>


{ (isClicked) ? 
            <div className='newtask-newtask'>
     <Form method="post">
               <div className='newtask'>
               <div className='newtask-text-div'>
              <input type="text" className='newtask-text' placeholder='enter a task here' name='taskname' value={task} onChange={(e) => setTask(e.target.value)} required maxLength={100}/>
              </div>
              <div className='newtask-btns'>
             <div> <button className='newtask-btns-btn' type="submit" name="type" value="newtask">add</button></div>
             <div> <button className='newtask-btns-btn' type="button" onClick={() => {setisClicked(false)}}>cancel</button></div>
             </div>
            </div>
     </Form>
             </div>
             :
             null

}

            
           <div className='tasklist-bar'>

            <div>
            {
            taskname.filter(task => !task.isChecked).map((task,index) =>  
                <Tasks key = {task._id} taskname = {task.taskname} index ={index} id={task._id}/>
            )
            }
            </div>
           
            </div>
            
            
        </div>
    )
}