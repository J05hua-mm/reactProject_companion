import './App.css';
import Sidebar from './components/homepage/sidebar.js';
import { Outlet,useLoaderData,redirect,Link,useLocation } from 'react-router-dom';
import axios from 'axios';
import { createContext, useEffect, useState} from 'react';
import Navigation from './components/homepage/navigation.js';

export async function appLoader() {

  try {
    const response = await axios.get('http://localhost:4000/sessionactive',{withCredentials:true});
    return response.data;
  }
  catch(err) {
     return err;
  }
}

export async function appAction() {
 
  try {
    const response = await axios.post("http://localhost:4000/logout",{},{withCredentials:true, headers:{
      "Content-Type": "application/x-www-form-urlencoded",
  }});
    return redirect("/");
  }
  catch(err) {
    return err;
  }
}

export const Logger = createContext(null);
// export const TimerState = createContext(null);

function App() {

const response = useLoaderData();
console.log(response);


  return (
    <div className="main-frame">

      <div className="main-frame-div-one">
         <Sidebar/>
      </div>

      <div className="main-frame-div-two">

        <div className="main-frame-div-two-one">
        <Navigation isLoggedin={response.loggedin}></Navigation>
        </div>

        <div className='main-frame-div-two-two'>
        <Outlet/>
        </div>
       
      </div>

      <div className="main-frame-div-three">

      </div>

    </div>
  );
}

export default App;
