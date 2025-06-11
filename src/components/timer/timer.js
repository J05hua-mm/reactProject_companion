import {useEffect, useRef, useState,} from "react";
import ReactHowler from "react-howler";
import track from "/Users/joshuamm/Desktop/web development/new project/new-project/src/assets/Track1.mp3";
import axios from "axios";
import { useLocation } from "react-router-dom";
import play from "../../assets/background-image/play_circle_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg";
import pause from "../../assets/background-image/pause_circle_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg";
import restart from "../../assets/background-image/restart_alt_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg"

export default function Timer() {
    

    const [minute,setMinute] = useState(60);
    const [second,setSecond] = useState(0);

    const [timer,setTimer] = useState(3600);

    const intervalref = useRef(null);

    const [btn,setBtn] = useState(false);

    const [timenow,setTimenow] = useState({isActive:false,state:"none",time:Date.now(),topicid:"none"});

    let location = useLocation();

    const pathname = location.pathname.split('/');



    function timerSet(name,value) {

        const Value = Number(value);
 
       
        if(name === "minute") {
            if(isNaN(Value)) {
                setMinute(0);
                setTimer(second);
                return;
            }
             let safeminute = Math.min(60,Math.max(0,Value));
             let safeSecond = second;

             if(safeminute === 60 && safeSecond > 0) {
                safeSecond = 0;
             }

             setMinute(safeminute);
             setSecond(safeSecond);
             setTimer(safeminute * 60 + safeSecond);

        }
        else if(name === "second") {
            if(isNaN(Value)) {
                setSecond(0);
                setTimer(minute * 60);
                return;
            }
           
          let safesecond = Math.min(60,Math.max(0,Value));
          let safeMinute = minute;

          if(safeMinute === 60) safesecond = 0;

          setMinute(safeMinute);
          setSecond(safesecond);
          setTimer(safeMinute * 60 + safesecond);
           
        }
       
    }


   function handleClick() {

    if(!btn) {
        intervalref.current = setInterval(() => setTimer(prev => prev - 1),1000);
        setTimenow({...timenow,isActive:true,state:'play',time:Date.now(),topicid:pathname[2]});
    }
    else {
        clearInterval(intervalref.current);
        setMinute(Math.floor(timer/60));
        setSecond(timer%60);
        setTimenow({...timenow,isActive:true,state:"pause",time:Date.now(),topicid:pathname[2]});
    }

    setBtn(prev => !prev);


   }

   function reset() {
    clearInterval(intervalref.current);
    setBtn(false);
    setTimer(3600);
    setMinute(60);
    setSecond(0);
    setTimenow({...timenow,isActive:true,state:"reset",time:Date.now(),topicid:pathname[2]});
   }

    useEffect(() => {

       const sendata = async (data) => {
                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/timerdata`,{data:data},{withCredentials:true,header:{
                        "Content-Type": "application/json",
                    }});
                }
                catch(err) {
                    console.log(err);
                }
       }


        if(timer === 0 && btn) {
            reset();
        }
        
        if(timenow.isActive) {
            sendata(timenow);
            setTimenow({...timenow,isActive:false});
        }

            },[timer,btn,timenow]);



    return (

       <div className="timer">

       <div className="timer-section">

       <span className="timer-minute" hidden={!btn}>{String(Math.floor(timer/60)).padStart(2,0)}</span>

           <input
            type="text"
            value={String(minute).padStart(2,'0')}
            onChange={(e) => timerSet("minute",e.target.value)}
            maxLength={4}
            className="timer-input"
            hidden={btn}
           >
           </input>

           <span className="timer-dot">:</span>

       <span className="timer-second" hidden={!btn}>{String(timer%60).padStart(2,0)}</span>

            <input
            type="text"
            value={String(second).padStart(2,'0')}
            onChange={(e) => timerSet("second",e.target.value)}
             maxLength={4}
             className="timer-input"
             hidden={btn}
            >
            </input>7

       </div>

   
       <div className="Timer-btn-section">
       <div style={{height:"1.5rem",width:"1.5rem",backgroundImage:btn ? `url(${pause})` : `url(${play})`}}> <button onClick={handleClick}></button> </div>
       <div style={{height:"1.5rem",width:"1.5rem",backgroundImage:`url(${restart})`}}> <button onClick={reset}></button> </div>
       </div>
      
     <ReactHowler
     src={track}
     playing={btn}
     loop={true}
     volume={1.0}
    //  onPlay={() => console.log("Audio playing")}
    //  onLoad={() => console.log("Audio loaded")}
     onLoadError={(id, err) => console.error("Load error:", err)}
     />

      </div>
    )
}


// {btn ? "Pause" : "Play"}