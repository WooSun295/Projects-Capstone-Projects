import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

import "./Offpage.css";

const Offpage = ({ msg }) => {
   return (
      <Card className="Offpage">
         <CardBody>
            <CardTitle className="Offpage-Header">
               <h3 className="Offpage-Title">{msg}</h3>
            </CardTitle>
         </CardBody>
      </Card>
   );
};

export default Offpage;
