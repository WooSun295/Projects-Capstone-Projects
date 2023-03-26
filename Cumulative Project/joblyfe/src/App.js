import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import "./App.css";

import JoblyAPI from "./API/JoblyAPI";
import NavBar from "./NavBar/NavBar";
import Mainpage from "./Mainpage/Mainpage";
import Company from "./Company/Company";
import Job from "./Job/Job";
import OffPage from "./OffPage/OffPage";

function App() {
   const [isLoading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [userToken, setToken] = useState(null);
   const [coDatas, setCoDatas] = useState([]);
   const [userDatas, setUserDatas] = useState([]);
   const [jobDatas, setJobDatas] = useState([]);

   useEffect(() => {
      async function getAll() {
         try {
            let companies = JoblyAPI.getAll("companies");
            let users =
               userToken &&
               JoblyAPI.getAll("users", {
                  authorization: `Bearer ${userToken}`,
               });
            let jobs = JoblyAPI.getAll("jobs");
            setCoDatas(await companies);
            setUserDatas(await users);
            setJobDatas(await jobs);
            setLoading(false);
         } catch (e) {
            setError(e.response);
         }
      }
      getAll();
   }, []);

   if (error) {
      return <OffPage msg={`${error.status} ${error.statusText}`} />;
   }

   if (isLoading) {
      return <OffPage msg="Loading &hellip;" />;
   }

   return (
      <div className="App">
         <Router>
            <NavBar />
            <main className="Jobly">
               <Switch>
                  {/* Companies Routes */}
                  <Route exact path="/companies">
                     <Mainpage title="companies" datas={coDatas} id="handle" />
                  </Route>
                  <Route exact path="/companies/:key">
                     <Company />
                  </Route>

                  {/* Jobs Routes */}
                  <Route exact path="/jobs">
                     <Mainpage title="jobs" datas={jobDatas} id="id" />
                  </Route>
                  <Route exact path="/jobs/:key">
                     <Job
                        title="jobs"
                        datas={jobDatas}
                        id="id"
                        cantfind="/jobs"
                        token={userToken}
                     />
                  </Route>

                  {/* Redirect to /companies */}
                  <Redirect to="/companies" />
               </Switch>
            </main>
         </Router>
      </div>
   );
}

export default App;
