import { useReducer, useState } from "react";
import {Form} from "react-router-dom";

export default function Card(props) {
    
    const [cardclick,setCardclick] = useState(false);
    const [cardname,setCardname] = useState(props.cname);
    const [cardesc,setCardesc] = useState(props.description);
    const links = props.link;
    const cardlist = props.cardlist;
    const intersection = links.filter(link => cardlist.includes(link));
  

    return (

        <div className="card">
    
          <Form method="post">

                   <div className="card-div-one">
                      <div className="card-div-one-cardnum">{props.cardnum}</div>
                      <div hidden = {cardclick} className="card-div-one-cardname">{cardname}</div>
                      <div hidden = {!cardclick}><input className="card-div-one-input" name="editedcardname" value={cardname} onChange={(e) => setCardname(e.target.value)}></input></div>
                      <div><input type="hidden" name="id" value={props.id}></input></div>
                   </div>

                   <div className="card-div-two">
                     <div hidden = {cardclick}>{cardesc}</div>
                     <textarea hidden = {!cardclick} name="editedcardesc" value={cardesc} onChange={(e) => setCardesc(e.target.value)}></textarea>
                   </div>

                    <div className="card-div-three">

                      <div className="card-div-three-links">
                      <div className="card-div-three-links-text">links:</div>     
                      <div className="card-div-three-links-link">{intersection.map((inter,index) => <button key={index} type="button" className="card-link-three-link-btn">{inter}</button>)}</div> 
                      </div>

                    <div className="card-div-three-btn">
                      <button className="card-div-three-btns" onClick={()=>setCardclick(true)} hidden = {cardclick} type="button">edit</button>
                      <button className="card-div-three-btns" onClick={() => setCardclick(false)} hidden = {!cardclick} type="submit" name="type" value="cardedit">done</button>
                      <button className="card-div-three-btns" type="submit" name="type" value="Cardelete">delete</button>
                    </div>
                    
                   </div>

           </Form>

        </div>

    ); 

}