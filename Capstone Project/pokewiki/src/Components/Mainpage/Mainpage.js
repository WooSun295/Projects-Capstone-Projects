import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";

import pluralize from "../..//helpers/pluralize";
import Offpage from "../Offpage/Offpage";
import PokeWikiAPI from "../../helpers/backend";
import fixString from "../../helpers/fixStrings";

import "./Mainpage.css";

const Mainpage = ({ title, userToken }) => {
   const [isLoading, setLoading] = useState(true);
   const [data, setData] = useState([]);
   const [favPkmn, setFav] = useState([]);

   useEffect(() => {
      setLoading(true);
      const getData = async () => {
         let data = await PokeWikiAPI.pokeGet(title);
         setData(data[pluralize(title)]);
         if (userToken) {
            let token = userToken._token
               ? userToken._token
               : JSON.parse(userToken)._token;
            let favs = await PokeWikiAPI.userGet(token, true);
            setFav(favs.favorites);
         }
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
                  <h3 className="Mainpage-Title">{fixString(title).toUpperCase()}</h3>
               </CardTitle>
            </CardBody>
            <CardBody className="Mainpage-Body">
               <ListGroup>
                  {data.map((d) => {
                     let isFav = favPkmn.some((fav) => {
                        return fav.id === d.id;
                     });
                     return (
                        <ListGroupItem key={d.id} className={title}>
                           <Link to={`/${title}/${d.id}`}>
                              {isFav && <p className="favorite">&#11088;</p>}
                              {d.imgUrl ? (
                                 <>
                                    <img
                                       src={d.imgUrl}
                                       alt={d.name}
                                       className={`${title}-img`}
                                    />
                                    <p className={`${title}-p`}>{fixString(d.name)}</p>
                                 </>
                              ) : (
                                 <p className={`no-img ${title}-p`}>
                                    {fixString(d.name)}
                                 </p>
                              )}
                           </Link>
                        </ListGroupItem>
                     );
                  })}
               </ListGroup>
            </CardBody>
         </Card>
      </div>
   );
};

export default Mainpage;
