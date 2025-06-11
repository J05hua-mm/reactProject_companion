import { Link,useLocation} from "react-router-dom";
import Timer from "../timer/timer.js";
import { useState,useEffect } from "react";
import axios from "axios";
import topicimg from "../../assets/icons/topic.svg";


export default function Sidebar() {

let location = useLocation();
const [timerstate,setTimerstate] = useState(false);

const patharr = location.pathname.split('/');

const pathverify = (arr) => {
  if(arr.length >= 3) {
     if(arr[1] === "topics") {
      return true;
     }
  }
  setTimerstate(false);
}

useEffect(() => {

  const verifier =  async (patharr) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/timerverify`,{pathname:patharr},{withCredentials:true, headers:{
            "Content-Type": "application/json",
        }});
        if(response.data.sucess) {
            setTimerstate(true);
        }
    } catch(err) {
        console.log(err);
    return err;
   }   
    }


    if(pathverify(patharr)) {
        verifier(patharr);
    }


},[location.pathname]); 


    return (
        <div className="sidebar">

        <div className='sidebar-heading'>
           <Link to='/'> companion </Link>
        </div>

           <div className="sidebar-nav">
      
            <Link to={"topics"}>
            <div className="sidebar-nav-link">
            <div className="sidebar-nav-link-img"><img src={topicimg}></img></div>
            <div className="sidebar-nav-link-text">topics</div>
           </div>
           </Link>

           </div>
    
           
          { timerstate ?
             <div className="sidebar-timer">
             <Timer/>
             </div>
             :
             ''
          }
          
        </div>
    );
}