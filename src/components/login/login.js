// import google from "../assets/google.png"
import {Form,redirect,useNavigate,useActionData} from "react-router-dom";
import axios from "axios";
import Errormessage from "../errors/errormessage.js";
import { useState } from "react";


export async function loginAction({ params, request }) {

        const formData = await request.formData();
        const data = Object.fromEntries(formData.entries());
        
        if(data.type === "login") {

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`,{username:data.email,password:data.password},{
            withCredentials:true,
            headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Explicitly set content type
          }
        });
            console.log(response);
            return redirect('/');
            } catch(err) {
            console.log(err);
            return err.response.data;
       }
        }
        else if(data.type === "signup") {
 
         if(data.password !== data.confirmPassword) {
          return {type:"signup",sucess:"false",message:"passwords doesn't match"}
         }

          try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/signup`,data,{
            withCredentials:true,
            headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Explicitly set content type
          }
        });
            console.log(response);
            return redirect('/topics');
            } catch(err) {
            console.log(err);
            return err.response.data;
      }
        }
      }


export default function Loginpage() {

    const actiondata = useActionData() || '';
    console.log(actiondata);

    const [toggle,setToggle] = useState(true);

    return (
        <div className="Loginpage">
{/*      

                 <div className="Login logindiv">

       <Form className="Loginform" method="post">

                 <div className="logindiv">
                    <p className="login-text">Sign-in</p>
                 </div>

                  <div className="logindiv">  
                    <input className="login-username" placeholder="E-mail" type="E-mail" name="username" required></input>
                  </div>

                  <div className="logindiv">
                   <input className="login-password" placeholder="password" type="password" name="password" required minLength={8} maxLength={20}></input>
                  </div>
       
                 <div className="logindiv">
                   <button className="login-btn" type="submit" name="type" value="login">login</button>
                </div>

                <div className="logindiv">
                    <p className="login-or">or</p>
                </div>

                <div className="logindiv">
                    <button className="login-google" ><img src={google}></img></button>
                </div>
 
                <div className="logindiv"> 
                {actiondata.type === "login" && !actiondata.success ? <Errormessage message={actiondata.message} colour="red"/> : ''}
                </div>
              

     </Form>
                
         </div>



     
         <div className="signup">

          <Form className="signupform" method="post">

          <div className="signupdiv">
            <p className="signup-text">register?</p>
          </div>
        
           <div className="signupdiv">
            <input className="signup-email" placeholder="Email" name="email" required></input>
           </div>

           <div className="signupdiv">
               <input className="signup-username" placeholder="username" type="text" name="username" required minLength={5} maxLength={20}></input>
           </div>

           <div className="signupdiv">
            <input className="signup-password" placeholder="password" type="password" name="password" required minLength={8} maxLength={20}></input>
           </div>

           <div className="signupdiv">
            <input className="signup-confirm" placeholder="confirm password" type="password" name="confirmPassword" required minLength={8} maxLength={20}></input>
           </div>

          <div className="signupdiv">
            <button type="submit" className="signup-btn" name="type" value="signup">sign-up</button>
          </div>
          
          <div className="signupdiv">
          {actiondata.type === "signup" && !actiondata.success ? <Errormessage message={actiondata.message} colour="red"/> : ''}
          </div>

          </Form>

         </div> */}
     
        

        <Form method="post">

          <div className="signupdiv">
            <input className="signup-email" placeholder="Email" name="email" required></input>
           </div>

          {!toggle ? 
          
          <div className="signupdiv">
          <input className="signup-username" placeholder="username" type="text" name="username" required minLength={5} maxLength={20}></input>
          </div>

         :

          ''

        }

           <div className="signupdiv">
            <input className="signup-password" placeholder="password" type="password" name="password" required minLength={8} maxLength={20}></input>
           </div>


          {!toggle ? 
          <div className="signupdiv">
          <input className="signup-confirm" placeholder="confirm password" type="password" name="confirmPassword" required minLength={8} maxLength={20}></input>
         </div>

         :

         ''
        }
           


           <div className="signin-btns">

          {toggle ? 

           <div>
                   <button className="signin-btns-btn" type="submit" name="type" value="login">login</button>
           </div>

             :

            <div>
            <button type="submit" className="signin-btns-btn" name="type" value="signup">sign-up</button>
          </div>

          }
            <div>
              <button onClick={() => setToggle(!toggle)} className="signin-btns-btn2" >{toggle ? "register" : "sign-in"}</button>
            </div>
             
           </div>

           <div className="signupError">
           {actiondata.type === "login" && !actiondata.success ? <Errormessage message={actiondata.message} colour="red"/> : ''}
           {actiondata.type === "signup" && !actiondata.success ? <Errormessage message={actiondata.message} colour="red"/> : ''}
           </div>

        </Form>

        
        
        </div>
    ) 
    
}
