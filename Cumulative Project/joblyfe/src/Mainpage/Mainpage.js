import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";
import ListCell from "../ListCell/ListCell";

import "./Mainpage.css";

const Mainpage = ({ title, datas, id }) => {
   return (
      <div className="Mainpage">
         <Card className="">
            <CardBody className="MP-Header">
               <CardTitle className="MP-Title">
                  <h3>{title.toUpperCase()}</h3>
               </CardTitle>
            </CardBody>
            <CardBody className="">
               <ListGroup className="grid">
                  {datas[title].map((data) => (
                     <ListCell
                        data={data}
                        title={title}
                        key={data[id]}
                        className="g-col-6"
                     />
                  ))}
               </ListGroup>
            </CardBody>
         </Card>
      </div>
   );
};

export default Mainpage;
