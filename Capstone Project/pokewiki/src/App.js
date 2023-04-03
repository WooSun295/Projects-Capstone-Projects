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

import PokeWikiAPI from "./helpers/backend";
import { login, signup, update } from "./Components/FormCom/formFields";

import "./App.css";
import FormCom from "./Components/FormCom/FormCom";

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
                     <FormCom
                        formFields={login}
                        addToken={addToken}
                        title="login"
                        changeForm={true}
                     />
                  </Route>
                  <Route exact path="/signup">
                     <FormCom
                        formFields={signup}
                        addToken={addToken}
                        title="signup"
                        changeForm={true}
                     />
                  </Route>

                  {/* User Routes */}
                  <Route exact path="/user/:username">
                     <UserDetails
                        userToken={userToken}
                        signout={removeToken}
                        deleteUser={deleteUser}
                     />
                  </Route>
                  <Route exact path="/user/:username/update">
                     <FormCom
                        formFields={update}
                        addToken={addToken}
                        title="user-update"
                        changeForm={false}
                        token={userToken}
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
