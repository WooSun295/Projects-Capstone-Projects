import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";
import NavBar from "../NavBar/NavBar";

import "./OffPage.css";

const ErrorPage = ({ msg }) => {
   return (
      <div className="App">
         <Router>
            <NavBar />
            <main>
               <Card className="OffPage">
                  <CardBody>
                     <CardTitle>
                        <h1>{msg}</h1>
                     </CardTitle>
                  </CardBody>
               </Card>
            </main>
         </Router>
      </div>
   );
};

export default ErrorPage;
