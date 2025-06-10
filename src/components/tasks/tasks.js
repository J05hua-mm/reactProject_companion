import {useState,useRef, useEffect} from 'react'
import {Form, redirect,useNavigation} from "react-router-dom";

export default function Tasks(props) {

const [clicked,setClicked] = useState(false);
const [checked,setChecked] = useState(false);
const navigation = useNavigation();

const checkref = useRef(null);


function handlechange() {
setChecked(true);
checkref.current?.requestSubmit();
}
  
  return (
       
   <div className='tasks'>
      <Form method="post" ref={checkref}>
       <div className='task'>
        
        <div className='task-item-one'>

        <input
       className = 'task-checkbox'
       type='checkbox' 
       id={"task"+props.index} 
       name='type' 
       value="checked" 
       checked={checked}
       onChange={handlechange} 
       disabled={checked}
       />  

        <input type="hidden" name="id" value={props.id}></input>
        </div>

        <div className='task-item-two'>
        <label hidden={clicked} className='task-item-two-label'>{props.taskname}</label>
           <input className = 'task-edit-text' type = 'text' placeholder = {props.taskname} hidden={!clicked} name="editedtask"/>      
        </div>

         <div className='task-item-three'>
         <button className='task-btn-edit' onClick = {() => setClicked(true)} hidden={clicked} type="button">edit</button>
            <button className='task-done' onClick = {() => setClicked(false)} hidden={!clicked} type="submit" name="type" value="editedtask">done</button>
         <button className='task-delete' type="submit" name="type" value="delete">delete</button>    
         </div>
         
       </div>
       </Form>
       </div>
    )
}