import {Link,useSubmit,useLocation,NavLink} from "react-router-dom";


export default function Navigation(props) {

    const submit = useSubmit();
    let location = useLocation();

    const locationpatharray = location.pathname.split('/');
    

    function logouthandle() {

      const answer = window.confirm("Do you want to logout");

         if(answer) {
           submit(null,{method:"post"})
        }
        else 
       {
       return;
       }

    }

    return (
    <nav className="nav-bar">
    
    <div className="nav-links">

      {locationpatharray.length > 2 && locationpatharray[1] === "topics" ? 
       
       <div>
       <NavLink to={"topics/" + locationpatharray[2] + "/overview"} className={({isActive}) => isActive ? "isActive" : "isNotactive"}>overview</NavLink>
       <NavLink to={"topics/" + locationpatharray[2]+ "/tasks"} className={({isActive}) => isActive ? "isActive" : "isNotactive"}>tasks</NavLink>
       <NavLink to={"topics/" + locationpatharray[2]+ "/notes"} className={({isActive}) => isActive ? "isActive" : "isNotactive"}>notes</NavLink>
      </div>
      :
      ""
      }
</div>
      
        <div className="homepage-login">

         {props.isLoggedin ? <button className="logoutbtn logbtn" onClick={logouthandle}>Logout</button> : <Link to={"login"}><button className="logbtn">log in</button></Link>}   

        </div>
    </nav>
    )
}