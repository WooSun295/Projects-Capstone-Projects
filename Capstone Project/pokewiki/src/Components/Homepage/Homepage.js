import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

import "./Homepage.css";

const Homepage = () => {
   return (
      <div className="Homepage">
         <Card>
            <CardBody className="Homepage-Header">
               <CardTitle>
                  <h3 className="Homepage-Title">Welcome To PokeWiki</h3>
               </CardTitle>
            </CardBody>
         </Card>
      </div>
   );
};

export default Homepage;
