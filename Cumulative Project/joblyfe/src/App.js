import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import Mainpage from "./Mainpage/Mainpage";
import NavBar from "./NavBar/NavBar";

function App() {
   return (
      <div className="App">
         <Router>
            <NavBar />
            <main>
               <Switch>
                  <Route exact path="/companies">
                     <Mainpage title="companies" />
                  </Route>
                  <Redirect to="/companies" />
               </Switch>
            </main>
         </Router>
      </div>
   );
}

export default App;
