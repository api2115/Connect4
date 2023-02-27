import React, {useEffect, useState} from "react";
import ChatMqtt from "./mqtt/mainchat"
import Nav from "./Nav";
import LoginPage from "./LoginPage";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Cookies from 'js-cookie'
import RegisterPage from "./RegisterPage";
import Game from "./connect4game/Game";
import UserPanel from "./UserPanel";
import UsersList from "./UsertsList";
import Hiscore from "./Hiscore";
function App() {

    const [user,setUser] = useState("")
    useEffect(()=>{
        if (Cookies.get("logged")!== undefined){
            setUser({"login":Cookies.get("logged")})
        } else {
            const guest="guest_"+Math.random().toString(16).substr(2, 8)
            console.log(guest)
            Cookies.set("logged",guest)
            setUser({"login":guest})
        }

    },[])

  return (
    <div className="App">
        <Router>
            <Nav user={user}/>
            <Routes>
                <Route exact path="/" element={<ChatMqtt user={user.login}/>}/>
                <Route exact path="/loginpage" element={<LoginPage user={user} setUser={setUser}/>}/>
                <Route exact path="/registerpage" element={<RegisterPage/>}/>
                <Route exact path="/game/:id" element={<Game/>}/>
                <Route exact path="/user" element={<UserPanel/>}/>
                <Route exact path="/ulist" element={<UsersList/>}/>
                <Route exact path="/hiscore" element={<Hiscore/>}/>
            </Routes>
        </Router>

    </div>
  );
}

export default App;
