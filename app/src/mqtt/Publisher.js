import React, {useState} from "react";

const Publisher = ({publish,topic}) =>{
    const [tekst,setTekst] = useState("")

    const handlechange = (e) =>{
        setTekst(e.target.value)
    }

    const handlesubmit = () =>{
        publish(topic,tekst)
    }


    return(
        <div>
            <input onChange={handlechange}/>
            <button onClick={handlesubmit}>wyslij</button>
        </div>
    )

}

export default Publisher