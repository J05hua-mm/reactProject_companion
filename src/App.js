import './App.css';
import Sidebar from './components/homepage/sidebar.js';
import { Outlet,useLoaderData,redirect,Link,useLocation,useNavigation } from 'react-router-dom';
import axios from 'axios';
import { createContext, useEffect, useState} from 'react';
import Navigation from './components/homepage/navigation.js';
import Spinner2 from "./components/spinners/outletSpinner.js"

export async function appLoader() {

  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/sessionactive`,{withCredentials:true});
    return response.data;
  }
  catch(err) {
     return err;
  }
}

export async function appAction() {
 
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/logout`,{},{withCredentials:true, headers:{
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
const navigation = useNavigation();


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
          {navigation.state === "loading" && <Spinner2/>}
        <Outlet/>
        </div>
       
      </div>

      <div className="main-frame-div-three">

      </div>

    </div>
  );
}

export default App;
