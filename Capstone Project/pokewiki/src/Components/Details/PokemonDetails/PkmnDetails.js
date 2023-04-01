import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";

import PokeWikiAPI from "../../../helpers/backend";
import Offpage from "../../Offpage/Offpage";

import fixString from "../../../helpers/fixStrings";
import extractId from "../../../helpers/extractId";

import "./PkmnDetails.css";

const PkmnDetails = ({ userToken }) => {
   const { id } = useParams();
   const [pkmnData, setPkmnData] = useState([]);
   const [favPkmn, setFavs] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [reload, setReload] = useState(false);
   const [removeFav, setRemove] = useState(false);
   let isFav;

   useEffect(() => {
      const getData = async () => {
         setIsLoading(true);
         let data = await PokeWikiAPI.pokeGet("pokemon", id);
         setPkmnData(data.pokemon);
         setIsLoading(false);
      };
      getData();
   }, [id]);

   useEffect(() => {
      const getFav = async () => {
         setIsLoading(true);
         let token;
         if (userToken) {
            token = userToken._token ? userToken._token : JSON.parse(userToken)._token;
            if (reload) {
               removeFav
                  ? await PokeWikiAPI.userDelete(token, id)
                  : await PokeWikiAPI.userPost(null, token, id);
            }
            let favs = await PokeWikiAPI.userGet(token, true);
            setFavs(favs.favorites);
         }

         setIsLoading(false);
      };
      getFav();
   }, [reload]);

   const toggleFav = (bool) => {
      setRemove(bool);
      setReload(true);
   };

   if (isLoading) return <Offpage msg="Loading &hellip;" />;
   else {
      isFav = favPkmn.some((fav) => {
         return fav.id === pkmnData.id;
      });
   }

   return (
      <div className="Pokemon-Details-Page">
         <Card>
            <CardBody className="PDP-Header">
               <CardTitle>
                  <h1 className="PDP-Title">
                     {isFav && <p className="PDP-Favorite">&#11088;</p>}
                     {fixString(pkmnData.name)}
                  </h1>
                  <small className="PDP-DexId">Dex Id: {pkmnData.id}</small>
               </CardTitle>
            </CardBody>
            <CardBody className="PDP-Body">
               <div>
                  {/* Pokemon Front and Back Imgs */}
                  <div className="PDP-Body">
                     <img
                        src={pkmnData.sprites.front_default}
                        alt="front_sprite"
                        className="Pkmn-Img"
                     />
                     {isFav ? (
                        <button
                           className="Pkmn-Btn RemoveF"
                           onClick={() => toggleFav(true)}
                        >
                           Remove Fav
                        </button>
                     ) : (
                        <button
                           className="Pkmn-Btn AddF"
                           onClick={() => toggleFav(false)}
                        >
                           Add Fav
                        </button>
                     )}
                     <img
                        src={pkmnData.sprites.back_default}
                        alt="back_sprite"
                        className="Pkmn-Img"
                     />
                  </div>

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
                                    className="Ability-Link"
                                 >
                                    {fixString(ability.name)}
                                    {is_hidden && <sup>(H)</sup>}
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
