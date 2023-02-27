import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import mqtt from "mqtt";
import axios from "axios";
import Cookies from 'js-cookie'
import "../app.css"
import GameChat from "./gamechat";

export default function Game(){
    let {id} = useParams()
    let navigate = useNavigate()
    const [client, setClient] = useState(null);
    const [isSubed, setIsSub] = useState(false);
    const [isSubedChat, setIsSubChat] = useState(false);
    const [payload, setPayload] = useState({});
    const [users,setUsers] = useState([])
    const [ready,setReady] = useState(false)
    const [gamespace,setGamespace] = useState([])
    const [currentplayer,setCurrentplayer] = useState("")
    const [cpcolor,setcpcolor] = useState("R")
    const [watch] = useState(false)
    // const [counterP1,setCounterP1]=useState(60)
    // const [counterP2,setCounterP2]=useState(30)
    //
    // useEffect(()=>{
    //     counterP1 > 0 && setTimeout(() => setCounterP1(counterP1 - 1), 1000);
    // },[counterP1])
    //
    // useEffect(()=>{
    //     counterP2 > 0 && setTimeout(() => setCounterP2(counterP2 - 1), 1000);
    // },[counterP2])

    useEffect(()=>{
        axios.get("http://localhost:5000/game/"+id)
            .then(response=>setUsers(response.data.players))

        axios.get("http://localhost:5000/game/"+id)
            .then(response=>setGamespace(response.data.gamespace))

        axios.get("http://localhost:5000/game/"+id)
            .then(response=>setCurrentplayer(response.data.turn))

        axios.get("http://localhost:5000/game/"+id)
            .then(response=>setcpcolor(response.data.color))
        // if(currentplayer===0){
        //     setCounterP1(60)
        // }else {
        //     setCounterP2(45)
        // }
    },[payload])

    useEffect(()=>{
        if(users.length===3){
            window.alert("wygrał:"+users[2])
            axios.delete("http://localhost:5000/game/"+id)
            navigate("/")
        }
    },[users])

    const mqttConnect = (mqttOption) => {
        setClient(mqtt.connect("ws://broker.emqx.io:8083/mqtt", mqttOption));
    };

    useEffect(() => {
        if (client) {
            client.on('connect', () => {
                mqttSub()
                mqttSubChat()
            });
            client.on('error', (err) => {
                console.error('Connection error: ', err);
                client.end();
            });
            client.on('message', (topic, message) => {
                const payload = { topic, message: message.toString() };
                setPayload(payload);
            });
        }
    }, [client])



    const mqttSub = () => {
        if (client) {
            client.subscribe("game/"+id, { qos:1 }, (error) => {
                if (error) {
                    console.log('Subscribe to topics error', error)
                    return
                }
                setIsSub(true)
            });
        }
    };

    const mqttSubChat = () =>{
        if (client) {
            client.subscribe("gamechat/"+id, { qos:1 }, (error) => {
                if (error) {
                    console.log('Subscribe to topics error', error)
                    return
                }
                setIsSubChat(true)
            });
        }
    }

    function handlewin(player,wins) {
        mqttPwin(player)
        if (player.slice(0, 5) !== "guest") {
            axios.patch("http://localhost:5000/users/" + player, {"won": parseInt(wins)+1})
                .then(Cookies.set('won', parseInt(wins)+1))
        }
    }

    function checker(gs,index,color,player){

        const level = 5-(gs[index].filter(x=>x==="O").length)
        const row = [gs.map(function (item){
            return item[level]
        })]
        const column = gs[index]
        const f_diagonal = []
        for(let i = -7;i<7;i++){
            if(gs[parseInt(index)+i]){
                if(gs[level-i]){
                    f_diagonal.push(gs[parseInt(index)+i][level-i])
                }

            }
        }
        const s_diagonal = []
        for(let i = -7;i<7;i++){
            if(gs[parseInt(index)+i]){
                if(gs[level+i]){
                    s_diagonal.push(gs[parseInt(index)+i][level+i])
                }

            }
        }
        const wygrane = Cookies.get("won")

            let score = 0
            for(let i = 0;i<column.length;i++){
                if(score<4){
                    if(column[i]===color){
                        score+=1
                    }else {
                        score=0
                    }
                }
            }

            if(score===4){
                handlewin(users[player],wygrane?wygrane:1)
            }

            score = 0
            for(let e = 0;e<row[0].length;e++){
                if(score<4){
                    if(row[0][e]===color){
                        score+=1
                    }else {
                        score=0
                    }
                }
            }

            if(score===4){
                handlewin(users[player],wygrane?wygrane:1)
            }

        score = 0
        for(let i = 0;i<f_diagonal.length;i++){
            if(score<4){
                if(f_diagonal[i]===color){
                    score+=1
                }else {
                    score=0
                }
            }
        }

        if(score===4){
            handlewin(users[player],wygrane?wygrane:1)
        }

        score = 0
        for(let i = 0;i<s_diagonal.length;i++){
            if(score<4){
                if(s_diagonal[i]===color){
                    score+=1
                }else {
                    score=0
                }
            }
        }

        if(score===4){
            handlewin(users[player],wygrane?wygrane:1)
        }
    }

    const mqttPwin = (payload)=>{
        if (client){
            axios.patch("http://localhost:5000/game/"+id,{"players":[...users,payload]})
            client.publish("game/"+id, payload, { qos:1,retain:true }, error => {
                if (error) {
                    console.log('Publish error: ', error);
                }
            });
        }
    }

    const mqttPublish = (payload) => {
        if (client) {
            if(ready){
                if(client.options.clientId===users[currentplayer]){
                    let x = gamespace[payload].filter(x=>x==="O").length
                    let g = gamespace
                    g[payload][(6-x)]=cpcolor
                    if(g[payload].length>6){
                        window.alert("wybierz inną kolumne")
                    } else {
                        if (currentplayer === 0) {
                            axios.patch("http://localhost:5000/game/" + id, {"turn": 1})
                        } else {
                            axios.patch("http://localhost:5000/game/" + id, {"turn": 0})
                        }
                        if (cpcolor === "R") {
                            axios.patch("http://localhost:5000/game/" + id, {"color": "B"})
                        } else {
                            axios.patch("http://localhost:5000/game/" + id, {"color": "R"})
                        }

                        axios.patch("http://localhost:5000/game/" + id, {"gamespace": g})
                            .then(checker(g, payload, cpcolor,currentplayer))
                    }
                }
            }else {
                axios.patch("http://localhost:5000/game/" + id, {"players": [...users, payload]})
            }
            }
            client.publish("game/"+id, payload, { qos:1,retain:true }, error => {
                if (error) {
                    console.log('Publish error: ', error);
                }
            });
        }


    function handlejoin(){
        let options = {
            clientId:Cookies.get("logged"),
            keepalive: 30,
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            will: {
                topic: 'WillMsg',
                payload: 'Connection Closed abnormally..!',
                qos: 0,
                retain: false
            },
            rejectUnauthorized: false
        }
        mqttConnect(options)
    }

    function handleready(){
        mqttPublish(Cookies.get("logged"))
        setReady(true)
    }

    function handleClick(e){
        if (Cookies.get("logged")===users[currentplayer]){
            mqttPublish(e.target.id)
        }else {
            window.alert("to nie twoja tura")
        }

    }

    function handlesurrender(){
        let ans = window.confirm("czy chcesz się poddać")
        if(ans){
            handlewin(users.filter(user=>user!==Cookies.get("logged"))[0],Cookies.get("won"))
        }
    }


    return(
        <div>
            {isSubed?ready && !watch?<div>Ruch:{users.length===2?users[currentplayer]:null}</div>:<button onClick={handleready}>Gotowy?</button>:users.length<2?<button onClick={handlejoin}>dołącz</button>:<button>oglądaj</button>}
            {users.length===2 && ready?
                <div className={"gamespace"}>
                    {/*<div>{Cookies.get("logged")===users[0]?<div>CountdownP1:{counterP1}</div>:<div>CountdownP2:{counterP2}</div>}</div>*/}
                <div className={"c4"}>
                    <div id={0} onClick={handleClick}>{gamespace[0]}</div>
                    <div id={1} onClick={handleClick}>{gamespace[1]}</div>
                    <div id={2} onClick={handleClick}>{gamespace[2]}</div>
                    <div id={3} onClick={handleClick}>{gamespace[3]}</div>
                    <div id={4} onClick={handleClick}>{gamespace[4]}</div>
                    <div id={5} onClick={handleClick}>{gamespace[5]}</div>
                    <div id={6} onClick={handleClick}>{gamespace[6]}</div>
                    <button onClick={handlesurrender}>Poddaj się</button>
                </div>
                </div>
                :<div></div>}
                <GameChat isSubedChat={isSubedChat} client={client}/>
        </div>
    )

}
