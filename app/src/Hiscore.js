import React, {useEffect, useState} from "react";
import axios from "axios";

export default function Hiscore(){
    const [ulist,setUlist] = useState([])
    const [refresh,setRefresh] = useState(false)
    const [hlist,setHlist] = useState([])

    useEffect(()=>{
        axios.get("http://localhost:5000/users")
            .then(response=>setUlist(response.data))
    },[refresh])

    useEffect(()=>{
        let h= ulist.sort(function (a,b){
            return b.won-a.won
        })
        setHlist(h.slice(0,10))
    },[ulist])

    // useEffect(()=>{
    //     if(hlist.length>0){
    //         hlist.map(function (item){
    //             axios.post("http://localhost:5000/score",{"login":item.login,"score":item.won})
    //         })
    //
    //     }
    // },[hlist])

    return(<div>
        {hlist.length>0?
            <div>{hlist.map(item=>{
                return(
                    <div>{item.login}:{item.won}</div>
                )
            })}</div>
            :null}
    </div>)
}