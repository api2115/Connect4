import React,{useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import Cookies from 'js-cookie'

export default function LoginPage({user,setUser}){
    const [login,setLogin] = useState(1)
    const [password,setPassword] = useState("")

    const md5 = require('md5')

    let navigate=useNavigate()

    function handleLogin(e){
        setLogin(e.target.value)
    }

    function handlePassword(e){
        setPassword(e.target.value)
    }

    function handleSubmit(){
        function log(userdata){
            if (md5(password)!==userdata.password){
                window.alert("Złe hasło")
            }else {
                Cookies.set('logged',userdata.login)
                Cookies.set('won',userdata.won)
                Cookies.set("role",userdata.role)
                setUser(userdata)
                navigate('/')
            }
        }

        async function getuser(){
            await axios.get("http://localhost:5000/users/"+login)
                .then(response=>log(response.data))
                .catch((error)=>{
                    window.alert("Użytkownik nie istnieje")
                })
        }
        getuser()
    }


    return(
        <div>
            <form>
                <input placeholder={"login"} onChange={handleLogin}/>
                <input placeholder={"hasło"} onChange={handlePassword}/>
                <button type="button" onClick={handleSubmit}>Zaloguj</button>
            </form>
            <Link to="/registerpage"><div>Nie masz konta? Zarejestruj się!!!</div></Link>
        </div>
    )
}