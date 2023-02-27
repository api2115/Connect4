import React from "react";

const Connection = ({connect,status,user}) =>{
    const conn = () => {
        const values = {
            host: 'broker.emqx.io',
            clientId: user,
            port: 8083,
        };
        const url = `ws://${values.host}:${values.port}/mqtt`
        const options = {
            clientId:values.clientId,
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
        connect(url,options)

    }


    return(
        <div>
            {status ?
                null:<button onClick={conn}>Wejdź</button>
            }
        </div>
    )

}

export default Connection