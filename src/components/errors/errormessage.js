export default function Errormessage(props) {

    return (
        <div className="errormessage">
         
         <p style={{color:props.colour,fontSize:"15px"}}>ⓘ {props.message}</p>

        </div>
    )
}