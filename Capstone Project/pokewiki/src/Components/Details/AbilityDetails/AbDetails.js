import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";

import PokeWikiAPI from "../../../helpers/backend";
import Offpage from "../../Offpage/Offpage";

import fixString from "../../../helpers/fixStrings";
import extractId from "../../../helpers/extractId";

import "./AbDetails.css";

const AbDetails = () => {
   const { id } = useParams();
   const [abData, setAbData] = useState();
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const getData = async () => {
         setIsLoading(true);
         let data = await PokeWikiAPI.pokeGet("ability", id);
         setAbData(data.ability);
         setIsLoading(false);
      };
      getData();
   }, [id]);

   if (isLoading) return <Offpage msg="Loading &hellip;" />;

   return (
      <div className="Ability-Details-Page">
         <Card>
            <CardBody className="ADP-Header">
               <CardTitle>
                  <h1 className="ADP-Title">{fixString(abData.name)}</h1>
                  <small className="ADP-ShortE">
                     {abData.effect_entries[1].short_effect}
                  </small>
               </CardTitle>
            </CardBody>
            <CardBody className="ADP-Body">
               <p className="ADP-Effect">Effect: {abData.effect_entries[1].effect}</p>
               <h2 className="ADP-ListTitle">Pokemon with {fixString(abData.name)}</h2>
               <ListGroup className="ADP-ListGroup">
                  {abData.pokemon.map((pkmn) => {
                     let { name, url } = pkmn.pokemon;

                     return (
                        <Link
                           to={`/pokemon/${extractId(url, "pokemon")}`}
                           className="ADP-ListLinks"
                        >
                           <ListGroupItem className="ADP-ListItems">
                              {fixString(name)}
                           </ListGroupItem>
                        </Link>
                     );
                  })}
               </ListGroup>
            </CardBody>
         </Card>
      </div>
   );
};

export default AbDetails;
