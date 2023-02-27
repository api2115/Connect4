import React, {  useEffect, useState } from 'react';
import mqtt from 'mqtt'
import Connection from './Connection';
import Publisher from "./Publisher";
import axios from "axios";
import GamesList from "../connect4game/GamesList";
import "../app.css"

const ChatMqtt = ({user}) =>{
    const [client, setClient] = useState(null);
    const [isSubed, setIsSub] = useState(false);
    const [payload, setPayload] = useState({});
    const [mlist,setMlist] = useState([])

    const mqttConnect = (host, mqttOption) => {
        setClient(mqtt.connect(host, mqttOption));
    };


    useEffect(() => {
        if (client) {
            client.on('connect', () => {
                mqttSub()
            });
            client.on('error', (err) => {
                console.error('Connection error: ', err);
                client.end();
            });
            client.on('reconnect', () => {

            });
            client.on('message', (topic, message) => {
                const payload = { topic, message: message.toString() };
                setPayload(payload);
            });
        }
    }, [client])


    useEffect(()=>{
        async function fetchMainChat(){
            axios.get('http://localhost:5000/mainchatlogs')
                .then(response=>setMlist(response.data))
        }
        fetchMainChat()
    },[payload])

    const mqttSub = () => {
        if (client) {
            client.subscribe("main", { qos:1 }, (error) => {
                if (error) {
                    console.log('Subscribe to topics error', error)
                    return
                }
                setIsSub(true)
            });
        }
    };

    const mqttPublish = (topic,payload) => {
        if (client) {
            axios.post("http://localhost:5000/mainchatlogs",{"login":client.options.clientId,"message":payload})
            client.publish(topic, payload, { qos:1,retain:true }, error => {
                if (error) {
                    console.log('Publish error: ', error);
                }
            });
        }
    }

    return (
        <>
            <div className={"mainchat"}>
                {mlist.length && isSubed>0?mlist.map(item=>{
                    return(
                        <div key={Math.random().toString(16).substr(2, 8)}>
                    <div key={item.login}>{item.login}</div>
                    <div key={item.message}>{item.message}</div>
                        </div>
                )
                }):<div>Wejdź do czatu</div>}
            </div>
            <Connection connect={mqttConnect} status={isSubed} user={user}/>
            {isSubed?<Publisher publish={mqttPublish} topic={"main"} />:null}
            <GamesList user={user}/>
        </>
    )

}

export default ChatMqtt