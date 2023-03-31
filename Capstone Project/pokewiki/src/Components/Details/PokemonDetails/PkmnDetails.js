import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";

import PokeWikiAPI from "../../../helpers/backend";
import Offpage from "../../Offpage/Offpage";

import fixString from "../../../helpers/fixStrings";
import extractId from "../../../helpers/extractId";

import "./PkmnDetails.css";

const PkmnDetails = () => {
   const { id } = useParams();
   const [pkmnData, setPkmnData] = useState();
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const getData = async () => {
         setIsLoading(true);
         let data = await PokeWikiAPI.pokeGet("pokemon", id);
         setPkmnData(data.pokemon);
         setIsLoading(false);
      };
      getData();
   }, [id]);

   if (isLoading) return <Offpage msg="Loading &hellip;" />;

   return (
      <div className="Pokemon-Details-Page">
         <Card>
            <CardBody className="PDP-Header">
               <CardTitle>
                  <h1 className="PDP-Title">{fixString(pkmnData.name)}</h1>
                  <small className="PDP-DexId">Dex Id: {pkmnData.id}</small>
               </CardTitle>
            </CardBody>
            <CardBody className="PDP-Body">
               <div>
                  {/* Pokemon Front and Back Imgs */}
                  <img
                     src={pkmnData.sprites.front_default}
                     alt="front_sprite"
                     className="Pkmn-Img"
                  ></img>
                  <img
                     src={pkmnData.sprites.back_default}
                     alt="back_sprite"
                     className="Pkmn-Img"
                  ></img>

                  {/* Pokemon Types */}
                  <div className="Pkmn-Data">
                     <h2 className="Types-Title">Types</h2>
                     <ListGroup>
                        {pkmnData.types.map((ty) => {
                           let { name } = ty.type;
                           return (
                              <ListGroupItem className="Type">
                                 {fixString(name)}
                              </ListGroupItem>
                           );
                        })}
                     </ListGroup>
                  </div>
                  {/* Pokemon Abilities */}
                  <div className="Pkmn-Data">
                     <h2 className="Abilities-Title">Abilities</h2>
                     <ListGroup>
                        {pkmnData.abilities.map((ab) => {
                           let { ability, is_hidden } = ab;
                           return (
                              <ListGroupItem className="Ability">
                                 <Link
                                    to={`/ability/${extractId(ability.url, "ability")}`}
                                 >
                                    {fixString(ability.name)}
                                    {is_hidden && <small>H</small>}
                                 </Link>
                              </ListGroupItem>
                           );
                        })}
                     </ListGroup>
                  </div>

                  {/* Pokemon Stats */}
                  <div className="Pkmn-Data">
                     <h2 className="Stats-Title">Stats</h2>
                     <table>
                        <tbody>
                           <tr>
                              {pkmnData.stats.map((st) => {
                                 let { name } = st.stat;
                                 return <td>{fixString(name)}</td>;
                              })}
                           </tr>
                           <tr>
                              {pkmnData.stats.map((st) => {
                                 let { base_stat } = st;
                                 return <td>{base_stat}</td>;
                              })}
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </CardBody>
         </Card>
      </div>
   );
};

export default PkmnDetails;
