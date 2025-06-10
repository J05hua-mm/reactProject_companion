import { redirect,useLoaderData,useNavigation } from 'react-router-dom';
import Note from './note.js';
import Newnote from './newnote.js';
import {useEffect, useState} from "react";
import axios from 'axios';

export async function cardsLoader({params,request}) {

  try {
    const response = await axios.get(`http://localhost:4000/topics/${params.topicid}/card`,{withCredentials:true});
    return response.data;
  }
  catch(err) {
    return err;
  }
}

export async function cardsAction({params,request}) {

 const response = await request.formData();
 const data = Object.fromEntries(response.entries());

if(data.type === "newcard")
{
try {
  const response = await axios.post(`http://localhost:4000/${params.topicid}/newcard`,data,{withCredentials:true,
   headers:{
    "Content-Type": "application/x-www-form-urlencoded"
   }
  })
  return redirect(`http://localhost:3000/topics/${params.topicid}/notes`);
}
catch (err) {
  return err;
}
}
else if(data.type === "cardedit") {

  try {
    const response = await axios.post(`http://localhost:4000/${params.topicid}/cards/${data.id}/edit`,data,{withCredentials:true,
     headers:{
      "Content-Type": "application/x-www-form-urlencoded"
     }
    })
    return redirect(`http://localhost:3000/topics/${params.topicid}/notes`);
  }
  catch (err) {
    return err;
  }

}
else if(data.type === "Cardelete") {

  try {
    const response = await axios.post(`http://localhost:4000/${params.topicid}/cards/${data.id}/delete`,data,{withCredentials:true,
     headers:{
      "Content-Type": "application/x-www-form-urlencoded"
     }
    })
    return redirect(`http://localhost:3000/topics/${params.topicid}/notes`);
  }
  catch (err) {
    return err;
  }

}
}


export default function Cardsbar() {

    const [newcard,setNewcard] = useState(false);
    const cards = useLoaderData();
    const totalcardlist = cards.map((card) => card.cardnum);
    const cardlist = cards.filter((card) => !card.isdeleted).map((card) => card.cardnum);
    const navigate = useNavigation();

    function newtaskcancelclick() {
      setNewcard(false);
    }

    useEffect(() => {
      if(navigate.state === 'idle') {
        setNewcard(false);
      }
    },[navigate.state])

    return (
        <div className='cardsbar'>
              
          <div className='cardsbar-btn'>
            <button onClick={() => setNewcard(!newcard)}>create new note</button>
          </div>

            {newcard && <div className='cardsbar-newcard'>
             <Newnote cardname={cardlist} newtaskcancelclick={newtaskcancelclick} totalcardlist={totalcardlist}/>
            </div>}

          <div className='cardsbar-card-section'>
            {
              cards.filter((card) => !card.isdeleted).map((card) => <Note key={card._id} cardnum={card.cardnum} cname={card.cardname} description={card.description} link={card.links} id={card._id} cardlist={cardlist}/>)
            }
          </div>

        </div>
    );
}