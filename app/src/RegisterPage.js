import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";


export default function RegisterPage(){
    const [login,setLogin] = useState(1)
    const [password,setPassword] = useState("")
    const [error,setError]=useState(false)
    const md5 = require('md5')
    let navigate=useNavigate()

    function handleLogin(e){
        setLogin(e.target.value)
    }

    function handlePassword(e){
        setPassword(e.target.value)
    }

    function handleSubmit(){
        async function postUser(login,password){
            axios.post('http://localhost:5000/users',{
                "login":login,
                "password":md5(password),
                "won":0,
                "role":"user"
            })
                .catch((error)=>{
                    window.alert("użytkownik istnieje")
                    setError(true)
                })

        }
        postUser(login,password)
        if(!error){
            navigate("/loginpage")
        }
    }

    return(
        <div>
            <form>
                <input placeholder={"login"} onChange={handleLogin}/>
                <input placeholder={"hasło"} onChange={handlePassword}/>
                {error?<div>Użytkownik istnieje</div>:null}
                <button type="button" onClick={handleSubmit}>Zarejestruj</button>
            </form>
        </div>
    )

}