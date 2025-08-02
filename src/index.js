import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App,{appAction, appLoader} from './App.js';
import reportWebVitals from './reportWebVitals.js';
import { createBrowserRouter, redirect, RouterProvider, } from 'react-router-dom';
import Error from "./components/errors/errorelement.js";
import Login, {loginAction} from "./components/login/login.js";
import Topicmain,{topicLoader,newtopicAction} from './components/topics/topicmain.js';
import Overview,{overviewLoader,overviewAction} from "./components/topics/overview.js";
import Tasks, { taskAction, taskLoader } from "./components/tasks/taskbar.js";
import Notes, {cardsAction,cardsLoader} from "./components/notes/notesbar.js";
import axios from "axios";
import Welcome from './components/homepage/welcome.js';
import Spinner from './components/spinners/loadingspinner.js';


const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    errorElement:<Error/>,
    loader:appLoader,
    action:appAction,
    children:[
      // {
      //   index:true,
      //   element:<Welcome/>,
      // },
     {
      path:"/topics",
      element:<Topicmain />,
      errorElement:<Error/>,
      loader:topicLoader,
      action:newtopicAction,
     },
     {
      path:"/login",
      element:<Login/>,
      action:loginAction,
    },
        {
          path:"topics/:topicid/overview",
          loader:overviewLoader,
          action:overviewAction,
          element:<Overview/>,
          errorElement:<Error/>
        },
        {
          path:"/topics/:topicid/tasks",
          element:<Tasks/>,
          errorElement:<Error/>,
          action:taskAction,
          loader:taskLoader
        },
        {
          path:"/topics/:topicid/notes",
          element:<Notes/>,
          errorElement:<Error/>,
          action:cardsAction,
          loader:cardsLoader,
        },
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<Spinner/>}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
 