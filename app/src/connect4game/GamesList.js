import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export default function GamesList({user}){
    const [games,setGames] = useState([])
    const [refresh,setRefresh] = useState(false)



    useEffect(()=>{
        axios.get("http://localhost:5000/game")
            .then(result=>setGames(result.data))
    },[refresh])

    function handleAddGame(){
        axios.post("http://localhost:5000/game",{
            "players":[],
            "gamechat":[],
            "gamespace":[["O","O","O","O","O","O"], ["O","O","O","O","O","O"], ["O","O","O","O","O","O"], ["O","O","O","O","O","O"], ["O","O","O","O","O","O"], ["O","O","O","O","O","O"], ["O","O","O","O","O","O"]],
            "turn":0,
            "color":"R",
        })
            .then(()=>setRefresh(!refresh))

    }

    return(
        <div>
            <h3>Lista gier</h3>
            <button onClick={handleAddGame}>zacznij nową gre</button>
            {games.length>0?games.map((game,index)=>{
                    if (game.players.length>=2){
                        return (null)
                    }else {
                        return(
                        <div className="game" key={index + 1}>
                            <div>{index + 1}</div>
                            <div>{game.players[0]}</div>
                            <div>{game.players[1] ? game.players[1] : null}</div>
                            <Link to={"/game/" + game._id}>
                                <button>Dołącz</button>
                            </Link>
                        </div>)
                    }

            }):<div>brak gier :((</div>}
        </div>
    )

}