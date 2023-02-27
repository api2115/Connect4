import React, {useEffect, useState} from "react";
import Cookies from "js-cookie"
import axios from "axios";


export default function UsersList(){
    const [role,setRole] = useState("user")
    const [ulist,setUlist] = useState([])
    const [refresh,setRefresh] = useState(false)
    const [dlt,setDlt] = useState([])

    useEffect(()=>{
        const r= Cookies.get("role")
        setRole(r)
        axios.get("http://localhost:5000/users")
            .then(result=>setUlist(result.data))
    },[refresh])

    function check(e){
        if(e.target.checked) {
            setDlt([...dlt,e.target.name])
        }else{
            dlt.splice(dlt.indexOf(e.target.name),1)
        }
        console.log(dlt)
    }

    function handleusun(){
        dlt.forEach(function (e){
            axios.delete("http://localhost:5000/users/"+e)
        })
        setDlt([])
        setRefresh(!refresh)
    }

    if(role!=="admin"){
        return (<div>Nie powinno cię tu być</div>)
    }else {
        return (<div>
            <div>Witam oto lista użytkowników</div>
            <div>
                {ulist.length>0?ulist.map(user=>{
                    return(
                        <div key={user._id}>
                            <input name={user._id} type={"checkbox"} onChange={check}/>
                            <div>{user.login}</div>
                        </div>
                    )
                }):null}
            </div>
            <button onClick={handleusun}>usun zaznaczone</button>
        </div>)
    }
}