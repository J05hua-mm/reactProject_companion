import {Link} from "react-router-dom";

export default function Topics(props) {
         
         const date = new Date(props.creationdate);
         
    return (

        <Link to = {"/topics/" + (props.id) + '/overview'}>
        <div className="Topics">
        <div className="Topic-num">{props.no + 1}</div>
        <div className="Topic-name">{props.topicname}</div>
        <div className="Topic-date">created at {date.getDate()}-{date.getMonth() + 1}-{date.getFullYear()}</div>
        </div>
        </Link>

    )
}