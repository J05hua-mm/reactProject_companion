import { Link } from "react-router-dom";
import { use, useContext } from "react";
import { Logger } from "../../App.js";

export default function Welcome() {

    const data = useContext(Logger);


    return (
        <div className="welcome">

            {
                data.loggedin ?
                 <div>
                  <h1>welcome back</h1>
                  <h1>{data.user}</h1>
                 </div> 
                 : 
                 <div>
                    <h1>welcome to companion app</h1>
                   <h1><Link to="/login">sign in</Link> for more</h1>
                   </div>
            }
             
          
       
        </div>
    );
}