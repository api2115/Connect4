import React, {  useEffect, useState } from 'react';
import mqtt from 'mqtt'
import axios from "axios";
import {useParams} from "react-router-dom";
import Publisher from "../mqtt/Publisher";
import Cookies from 'js-cookie'

export default function GameChat({isSubedChat,client}){
    let {id} = useParams()
    const [payload, setPayload] = useState({});
    const [mlist,setMlist] = useState([])


    useEffect(() => {
        if (client) {
            client.on('connect', () => {
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

    useEffect(()=>{
        async function fetchGameChat(){
            axios.get('http://localhost:5000/game/'+id)
                .then(response=>setMlist(response.data.gamechat))
        }
        fetchGameChat()
    },[payload])


    const mqttPublish = (topic,payload) => {
        if (client) {
            axios.patch("http://localhost:5000/game/"+id,{"gamechat":[...mlist,{"login":client.options.clientId,"message":payload}]})
            client.publish(topic, payload, { qos:1,retain:true }, error => {
                if (error) {
                    console.log('Publish error: ', error);
                }
            });
        }
    }

    return(
        <div>
            {mlist.length>0 && isSubedChat?
                mlist.map(item=>{
                    return(
                        <div key={Math.random().toString(16).substr(2, 8)}>
                            <div key={item.login}>{item.login}</div>
                            <div key={item.message}>{item.message}</div>
                        </div>
                    )
                })
                :null}
            {isSubedChat?<Publisher publish={mqttPublish} topic={"gamechat/"+id} />:null}
        </div>
    )

}