import { useRef, useState } from "react";
import axios from "axios";
import { useLoaderData,Form,redirect } from "react-router-dom";

export async function overviewLoader({params,request}) {

  const param = params.topicid;
  
  try {
   const response = await axios.get(`${process.env.REACT_APP_API_URL}/topics/${param}/overview`,{
      withCredentials:true,
   });
   return response.data;
  } catch(err) {
   console.log(err);
   return err;
  }

}

export async function overviewAction({params,request}) {

 const formdata = await request.formData();
 const data = Object.fromEntries(formdata.entries());
 const param = params.topicid;

try {

   const response = await axios.post(`${process.env.REACT_APP_API_URL}/${param}/overview`,data,{
      withCredentials:true,
      headers:{
         "Content-Type": "application/x-www-form-urlencoded",
     }
   })
   return redirect(`/topics/${param}/overview`);
}
catch(err) {
return err;
}

}

export default function Overview() {

   const data = useLoaderData();

    const [clicked1,setClicked1] = useState(false);
    const [clicked2,setClicked2] = useState(false);
    const [clicked3,setClicked3] = useState(false);
    const [topicname,setTopicname] = useState(data.topicname);
    const [topicdesc,setTopicdesc] = useState(data.description);
    const [estdate,setEstdate] = useState();
    const topicnameinput = useRef(null);
    const topicdescinput = useRef(null);
    const date = String(new Date().getFullYear()) + '-' + String((new Date().getMonth() + 1)).padStart(2,"0") + '-' + String(new Date().getDate()).padStart(2,'0');

     
    return (
        
        <div className="overview">

         <div className="overview-section">

         <div>
            <Form className="overview-div" method="post">
            <div className="overview-div-one">topicname</div>
            <div className="overview-div-two overview-name"> <span hidden={clicked1}>{topicname}</span><div className="overview-name-input" hidden={!clicked1}><input ref={topicnameinput} type="text"  value={topicname} onChange={(e) => setTopicname(e.target.value)} name="topicname" required minLength={2} maxLength={30}></input></div></div>
            <div className="overview-div-three">
               <button className="overview-btn" hidden={clicked1} onClick={() => setClicked1(true)} type="button">edit</button>
               <button className="overview-btn" hidden={!clicked1} type="submit" name="type" value="topicname" onClick={() => setClicked1(false)}>done</button>
            </div>
            </Form>
         </div>

         <div>
            <Form className="overview-div" method="post">
            <div className="overview-div-one">description</div>
            <div className="overview-div-two overview-div-two-description" hidden={clicked2}>{topicdesc}</div>
            <div className="overview-div-two overview-textarea" hidden={!clicked2}><textarea name="topicdescription" ref={topicdescinput} value={topicdesc} onChange={() => setTopicdesc((prev) => {prev = topicdescinput.current.value;return prev})} required minLength={10} maxLength={200}></textarea></div>
            <div className="overview-div-three">
               <button className="overview-btn" hidden={clicked2} onClick={() => setClicked2(true)} type="button">edit</button>
               <button className="overview-btn" hidden={!clicked2} onClick={() => setClicked2(false)} type="submit" name="type" value="topicdescription">done</button>
            </div>
            </Form>
         </div>

         <div className="overview-div">
            <div className="overview-div-one">created at</div>
            <div className="overview-div-two"> {String(new Date(data.creationdate).getDate()).padStart(2,'0') + '-' + String((new Date(data.creationdate).getMonth() + 1)).padStart(2,'0') + '-' + String(new Date(data.creationdate).getFullYear())}</div>
            <div className="overview-div-three"></div>
         </div>

         <div>
            <Form method="post" className="overview-div">
              <div className="overview-div-one">end date</div>
              <div className="overview-div-two overview-estdate"><span hidden={clicked3}>{String(new Date(data.estimatedenddate).getDate()).padStart(2,'0') + '-' + String((new Date(data.estimatedenddate).getMonth() + 1)).padStart(2,'0') + '-' + String(new Date(data.estimatedenddate).getFullYear())}</span><input type="date" hidden={!clicked3} name="estimatedate" min={date} defaultValue={date}></input></div>
              <div className="overview-div-three">
               <button className="overview-btn" hidden={clicked3} onClick={() => setClicked3(true)} type="button">edit</button>
               <button className="overview-btn" hidden={!clicked3} onClick={() => setClicked3(false)}  type="submit" name="type" value="estimatedate">done</button>
             </div>
            </Form>
         </div>
         
         <div className="overview-div">
            <div className="overview-div-one">no. of tasks</div>
            <div className="overview-div-two">{data.no_of_tasks}</div>
            <div className="overview-div-three"></div>
         </div>
          
         <div className="overview-div">
            <div className="overview-div-one">no. of notes</div>
            <div className="overview-div-two">{data.no_of_notes}</div>
            <div className="overview-div-three"></div>
         </div>

         <div className="overview-div">
            <div className="overview-div-one">hours spent</div>
            <div className="overview-div-two">{Number(data.no_of_hours).toFixed(2)}</div>
            <div className="overview-div-three"></div>
         </div>

         </div>

        

        </div>
    )
}