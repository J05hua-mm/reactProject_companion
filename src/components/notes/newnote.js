import { useRef, useState } from "react";
import {Form} from "react-router-dom";

export default function Newcard(props) {
   
   const length = props.length;     
   const [cardlist,setCardlist] = useState([]);
   const [isClicked,setisClicked] = useState(false);
   const [isHidden,setisHidden] = useState(false);
   const cardname = props.cardname;
    
    
    function handleclick(event,index) {
      
      let value = event.target.value;
      if(cardlist.includes(value)) {
        let newlist = cardlist.filter((item) => item !== value);
        setCardlist((prevvalue) => [...newlist]);
      }
      else if(!cardlist.includes(value)) {
        setCardlist((prevvalue) => [
          ...prevvalue,
          value
        ]);
      }
    }
  
    return (
        <div className="newcard">
          <Form method="post">
                <div className="newcard-div-onetwo">
                <div className = 'newcard-div-one'>
                <label className="Newcard-no"><span>note no.</span>{"C" + (props.totalcardlist.length) }</label> 
                <input type="hidden" name="cardnum" value={"C" + (props.totalcardlist.length) }></input>
                </div>
     
                <div className = 'newcard-div-two'>
                <label className="Newcard-name">about*</label>
                <input className='Newcard-name-input' type="text" name = "cardname" required maxLength={50}></input>
                </div>

       </div>
      
      <div className = 'newcard-div-three' >
      <label className="Newcard-desc-label">note*</label>
      <textarea  className='Newcard-desc-input' id="comment" name="comment" placeholder="Enter your comment here..." required minLength={10}></textarea>
      </div>

     
      <div className = 'newcard-div-four'>
      <label className="Newcard-links">links</label>  
      <div className="Newcard-links-added">
      {
        cardlist.map((card,index) => 
          <button style={{backgroundColor:"gray",color:"white",border:"1px solid gray",borderRadius:"2px"}} type="button">{card}</button>
        )
      }
      </div>
      <div className="Newcard-links-addbtn">
        <button onClick= {() => setisHidden(!isHidden)} type="button">{isHidden ? "done" : "add"}</button>
        </div>
      </div>

{
  isHidden && (
    <div className="newcard-div-five">
    <div className="newcard-div-five-text">select</div>
    <div className="newcard-div-five-input">
    {
        cardname.map((card,index) =>  
            <input type="button" value={card} onClick = {(e) => {
              handleclick(e,index)}}
              style={{backgroundColor:cardlist.includes(card)?"gray":"white",color:cardlist.includes(card)?"white":"black",cursor:"pointer",border:"1px solid gray"}}
              />
        )
        }
    </div>
    </div>
  )
}

<input type="hidden" name="cardslist" value={cardlist}></input>
      
      <div className = 'newcard-div-six'>
      <button className="Newcard-div-six-btn" type="submit" name="type" value="newcard">submit</button>
      <button className="Newcard-div-six-btn" type="button" onClick={props.newtaskcancelclick}>cancel</button>
      </div>
      </Form>
        </div>
    ) 
}