import React from "react";
import {Link, useNavigate} from "react-router-dom";
import Cookie from 'js-cookie'
import "./app.css"

export default function Nav({user}){

    let navigate=useNavigate()
    function handlelogout(){
        Cookie.remove("logged")
        window.location.reload("true")
    }

    return(
        <nav>
            <Link to="/"><h1>Connect4Network</h1></Link>
            <div>Zalogowany użytkownik:{user.login}</div>
            {user?user.login.substr(0,5)==="guest"?<Link to="/loginpage"><button>Logowanie</button></Link>:<div><button onClick={handlelogout}>wyloguj</button><button onClick={()=>navigate("/user")}>Panel użytkownika</button></div>:null}
        </nav>
    )
}