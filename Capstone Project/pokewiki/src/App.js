import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import PkmnDetails from "./Components/Details/PokemonDetails/PkmnDetails";
import AbDetails from "./Components/Details/AbilityDetails/AbDetails";
import ItemDetails from "./Components/Details/ItemDetails/ItemDetails";
import BerryDetails from "./Components/Details/BerryDetails/BerryDetails";
import Mainpage from "./Components/Mainpage/Mainpage";
import Homepage from "./Components/Homepage/Homepage";
import LogSign from "./Components/login-signup/LogSign";
import UserDetails from "./Components/Details/UserDetails/UserDetails";

import "./App.css";
import PokeWikiAPI from "./helpers/backend";

function App() {
   const [userToken, setUserToken] = useState(localStorage.getItem("token"));

   const addToken = (tok) => {
      setUserToken(tok);
      localStorage.setItem("token", JSON.stringify(tok));
   };

   const removeToken = () => {
      setUserToken(null);
      localStorage.removeItem("token");
   };

   const deleteUser = async (username) => {
      setUserToken(null);
      await PokeWikiAPI.userDelete(username, JSON.parse(userToken)._token);
      localStorage.removeItem("token");
   };

   return (
      <div className="App">
         <Router>
            <Navbar userToken={userToken} />
            <main className="Pokewiki">
               <Switch>
                  <Route exact path="/">
                     <Homepage />
                  </Route>

                  {/* Pokemon routes */}
                  <Route exact path="/pokemon">
                     <Mainpage title="pokemon" />
                  </Route>
                  <Route exact path="/pokemon/:id">
                     <PkmnDetails />
                  </Route>

                  {/* Aility routes */}
                  <Route exact path="/ability">
                     <Mainpage title="ability" />
                  </Route>
                  <Route exact path="/ability/:id">
                     <AbDetails />
                  </Route>

                  {/* Item Routes */}
                  <Route exact path="/item">
                     <Mainpage title="item" />
                  </Route>
                  <Route exact path="/item/:id">
                     <ItemDetails />
                  </Route>

                  {/* Berry Routes */}
                  <Route exact path="/berry">
                     <Mainpage title="berry" />
                  </Route>
                  <Route exact path="/berry/:id">
                     <BerryDetails />
                  </Route>

                  {/* Auth Routes */}
                  <Route exact path="/login">
                     <LogSign title="login" addToken={addToken} />
                  </Route>
                  <Route exact path="/signup">
                     <LogSign title="signup" addToken={addToken} />
                  </Route>

                  {/* User Routes */}
                  <Route exact path="/user/:username">
                     <UserDetails
                        userToken={userToken}
                        signout={removeToken}
                        deleteUser={deleteUser}
                     />
                  </Route>
                  <Redirect to="/" />
               </Switch>
            </main>
         </Router>
      </div>
   );
}

export default App;
