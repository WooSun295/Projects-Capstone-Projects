import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";

import "./App.css";
import Mainpage from "./Components/Mainpage/Mainpage";
import Homepage from "./Components/Homepage/Homepage";
import FormCom from "./Components/FormCom/FormCom";

import { signup } from "./Components/FormCom/formFields";

function App() {
   const [userToken, setUserToken] = useState(null);

   return (
      <div className="App">
         <Router>
            <Navbar user={userToken} />
            <main className="Pokewiki">
               <Switch>
                  <Route exact path="/">
                     <Homepage />
                  </Route>
                  <Route exact path="/pokemon">
                     <Mainpage title="pokemon" />
                  </Route>
                  <Route exact path="/ability">
                     <Mainpage title="ability" />
                  </Route>
                  <Route exact path="/item">
                     <Mainpage title="item" />
                  </Route>
                  <Route exact path="/berry">
                     <Mainpage title="berry" />
                  </Route>
                  <Route exact path="/login">
                     <FormCom
                        formFields={signup}
                        addToken={setUserToken}
                        title="Sign Up"
                     />
                  </Route>
                  <Route exact path="/signup">
                     <FormCom />
                  </Route>
                  <Redirect to="/" />
               </Switch>
            </main>
         </Router>
      </div>
   );
}

export default App;
