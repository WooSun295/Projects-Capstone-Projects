import React, { useState, useEffect } from "react";
import { Redirect, useParams, Link } from "react-router-dom";
import {
   Card,
   CardBody,
   CardTitle,
   CardText,
   ListGroup,
   ListGroupItem,
} from "reactstrap";
import getLogo from "../logos/getLogo";
import "./Company.css";
import JoblyAPI from "../API/JoblyAPI";
import ListCell from "../ListCell/ListCell";
import OffPage from "../OffPage/OffPage";

const Company = () => {
   const { key } = useParams();
   const [error, setError] = useState(null);
   const [isLoading, setLoading] = useState(true);
   const [com, setCom] = useState();

   useEffect(() => {
      async function getData() {
         try {
            let com = await JoblyAPI.get("companies", key);
            setCom(com.company);
            setLoading(false);
         } catch (e) {
            setError(e.response);
         }
      }
      getData();
   }, []);

   if (error) {
      return <OffPage msg={`${error.status} ${error.statusText}`} />;
   }

   if (isLoading) {
      return <OffPage msg="Loading &hellip;" />;
   }

   let logo = null;
   let color = null;
   if ("logoUrl" in com) ({ logo, color } = getLogo(com.logoUrl));

   return (
      <section className="Company">
         <Card>
            <CardBody>
               <CardTitle className="Company-Heading">
                  {"logoUrl" in com &&
                     (logo ? (
                        <img src={logo} className="Company-Img"></img>
                     ) : (
                        <img
                           className="img-thumbnail"
                           src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
                        />
                     ))}
                  <h1 className="Company-Title">{com.name}</h1>
               </CardTitle>
            </CardBody>
            <CardBody>
               <CardText className="Company-Desc">{com.description}</CardText>
            </CardBody>
            <CardBody className="container">
               <ListGroup className="row">
                  {com.jobs.map((job) => (
                     <ListCell
                        data={job}
                        title="jobs"
                        color={color}
                        key={job.id}
                        className="col-6  "
                     />
                  ))}
               </ListGroup>
            </CardBody>
         </Card>
      </section>
   );
};

export default Company;
