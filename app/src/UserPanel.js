import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie"
import {useNavigate} from "react-router-dom";

export default function UserPanel(){
    const [role,setRole] = useState("")
    const [user,setUser] = useState(null)
    const [changelogin,setchangelogin] = useState(false)
    const [changepassword,setchangepassword] = useState(false)
    const [newlogin,setnewlogin] = useState("")
    const [newpasswd,setnewpasswd] = useState("")
    const [oldpasswd,setoldpassswd] = useState("")
    const [refresh] = useState(false)
    const u = Cookies.get("logged")
    let navigate = useNavigate()
    const md5 = require('md5')


    useEffect(()=>{
        axios.get("http://localhost:5000/users/"+u)
            .then(result=>setUser(result.data))
        axios.get("http://localhost:5000/users/"+u)
            .then(result=>setRole(result.data.role))
    },[refresh])

    function handledeletechat(){
        const m = window.confirm("Czy na pewno chcesz to zrobić, przepadnie cała historia czatu")
        if(m){
            axios.delete("http://localhost:5000/mainchatlogs")
        }
    }

    function handlelogin(e){
        setnewlogin(e.target.value)
    }
    function handlepasswd(e){
        setnewpasswd(e.target.value)
    }
    function handleoldpasswd(e){
        setoldpassswd(e.target.value)
    }

    function handlechangelogin(){
        window.alert("zmieniasz login na:"+newlogin)
        axios.patch("http://localhost:5000/users/"+u,{"login":newlogin})
        Cookies.set("logged",newlogin)
    }

    function handlechangepassword(){
        if (md5(oldpasswd)===user.password){
            window.alert("zmieniasz hasło")
            axios.patch("http://localhost:5000/users/"+u,{"password":md5(newpasswd)})
        }else {
            window.alert("podałeś złe stare hasło")
        }
    }

    function handledeleteacc(){
        const m = window.confirm("czy chcesz usunąć swoje konto?;))")
        if(m){
            axios.delete("http://localhost:5000/users/"+user._id)
            Cookies.remove("logged")
            navigate("/")
            window.location.reload("true")
        }
    }

    return(
        <div>{role==="admin"?<div>
                <div>Witaj administratorze</div>
                <button onClick={()=>navigate("/ulist")}>Lista użytkowników</button>
                <button onClick={handledeletechat}>Usuń historie głównego czatu</button>
        </div>
            :null}

            {user?<div><button onClick={()=>setchangelogin(!changelogin)}>Zmień login</button>
                <button onClick={()=>setchangepassword(!changepassword)}>Zmień hasło</button>
                <button onClick={handledeleteacc}>Usuń konto</button></div>
                :null}
            {changelogin?<form onSubmit={handlechangelogin}>
                <input onChange={handlelogin} placeholder={"nowy login"}/>
                <input type={"submit"}/>
            </form>:null}
            {changepassword?<form onSubmit={handlechangepassword}>
                <input onChange={handleoldpasswd} placeholder={"stare hasło"}/>
                <input onChange={handlepasswd} placeholder={"nowe hasło"}/>
                <input type={"submit"}/>
            </form>:null}
        </div>
    )
}