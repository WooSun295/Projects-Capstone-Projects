import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import PkmnDetails from "./Components/Details/PokemonDetails/PkmnDetails";
import AbDetails from "./Components/Details/AbilityDetails/AbDetails";
import ItemDetails from "./Components/Details/ItemDetails/ItemDetails";
import BerryDetails from "./Components/Details/BerryDetails/BerryDetails";
import Mainpage from "./Components/Mainpage/Mainpage";
import Homepage from "./Components/Homepage/Homepage";
import UserDetails from "./Components/Details/UserDetails/UserDetails";
import Login from "./Components/Forms/Login";
import Signup from "./Components/Forms/Signup";

import PokeWikiAPI from "./helpers/backend";

import "./App.css";
import UserUpdate from "./Components/Forms/UserUpdate";

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
                     <Mainpage title="pokemon" userToken={userToken} />
                  </Route>
                  <Route exact path="/pokemon/:id">
                     <PkmnDetails userToken={userToken} />
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
                     <Login addToken={addToken} />
                  </Route>
                  <Route exact path="/signup">
                     <Signup addToken={addToken} />
                  </Route>

                  {/* User Routes */}
                  <Route exact path="/user/:username">
                     <UserDetails userToken={userToken} signout={removeToken} />
                  </Route>
                  <Route exact path="/user/:username/update">
                     <UserUpdate addToken={addToken} token={userToken} />
                  </Route>
                  <Redirect to="/" />
               </Switch>
            </main>
         </Router>
      </div>
   );
}

export default App;
