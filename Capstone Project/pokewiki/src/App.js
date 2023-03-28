import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";

import "./App.css";
import Mainpage from "./Components/Mainpage.js/Mainpage";

function App() {
   return (
      <div className="App">
         <Router>
            <Navbar user={{ username: null, pfpUrl: null }} />
            <main className="Pokewiki">
               <Switch>
                  <Route exact path="/"></Route>
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
                  <Route exact path="/login"></Route>
                  <Route exact path="/signup"></Route>
                  <Redirect to="/" />
               </Switch>
            </main>
         </Router>
      </div>
   );
}

export default App;
