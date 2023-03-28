import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";

import pluralize from "../..//helpers/pluralize";
import Offpage from "../Offpage.js/Offpage";
import PokeWikiAPI from "../../helpers/backend";

import "./Mainpage.css";

const Mainpage = ({ title }) => {
   const [isLoading, setLoading] = useState(true);
   const [data, setData] = useState([]);

   useEffect(() => {
      setLoading(true);
      const getData = async () => {
         let data = await PokeWikiAPI.getAll(title);
         setData(data[pluralize(title)]);
         setLoading(false);
      };
      getData();
   }, [title]);

   if (isLoading) return <Offpage msg="Loading &hellip;" />;

   return (
      <div className="Mainpage">
         <Card>
            <CardBody className="Mainpage-Header">
               <CardTitle>
                  <h3 className="Mainpage-Title">{title.toUpperCase()}</h3>
               </CardTitle>
            </CardBody>
            <CardBody className="Mainpage-Body">
               <ListGroup>
                  {data.map((d) => (
                     <ListGroupItem key={d.id} className={title}>
                        <Link to={`/${title}/${d.id}`}>
                           {d.imgUrl ? (
                              <>
                                 <img
                                    src={d.imgUrl}
                                    alt={d.name}
                                    className={`${title}-img`}
                                 />
                                 <p className={`${title}-p`}>{d.name}</p>
                              </>
                           ) : (
                              <p className={`no-img ${title}-p`}>{d.name}</p>
                           )}
                        </Link>
                     </ListGroupItem>
                  ))}
               </ListGroup>
            </CardBody>
         </Card>
      </div>
   );
};

export default Mainpage;
