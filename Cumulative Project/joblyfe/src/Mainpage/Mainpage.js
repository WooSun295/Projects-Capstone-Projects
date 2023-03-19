import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JoblyAPI from "../API/JoblyAPI";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";
import "./Mainpage.css";

const Mainpage = ({ title }) => {
   const [isLoading, setLoading] = useState(true);
   const [datas, setDatas] = useState([]);
   let key = "";
   if (title === "companies") key = "handle";
   else if (title === "users") key = "username";
   else if (title === "jobs") key = "id";

   useEffect(() => {
      async function getAll() {
         let datas = JoblyAPI.getAll(title);
         setDatas(await datas);
         setLoading(false);
      }
      getAll();
   }, []);

   if (isLoading) {
      return <p>Loading &hellip;</p>;
   }

   return (
      <div className="Mainpage">
         <Card>
            <CardBody>
               <CardTitle className="font-weight-bold text-center">
                  <h3>{title.toUpperCase()}</h3>
               </CardTitle>
            </CardBody>
            <CardBody>
               <ListGroup>
                  {datas[title].map((data) => (
                     <Link to={`/${title}/${data[key]}`} key={data[key]}>
                        <ListGroupItem>{data.name}</ListGroupItem>
                     </Link>
                  ))}
               </ListGroup>
            </CardBody>
         </Card>
      </div>
   );
};

export default Mainpage;
