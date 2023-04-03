import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";
import axios from "axios";

import PokeWikiAPI from "../../../helpers/backend";
import Offpage from "../../Offpage/Offpage";

import fixString from "../../../helpers/fixStrings";

import "./BerryDetails.css";

const BerryDetails = () => {
   const { id } = useParams();
   const [bryData, setBryData] = useState();
   const [bryItemData, setBryItemData] = useState();
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const getData = async () => {
         setIsLoading(true);
         let data = await PokeWikiAPI.pokeGet("berry", id);
         let imgUrl = await axios.get(data.berry.item.url);
         setBryData(data.berry);
         setBryItemData(imgUrl.data);
         setIsLoading(false);
      };
      getData();
   }, [id]);

   if (isLoading) return <Offpage msg="Loading &hellip;" />;

   return (
      <div className="Berry-Details-Page">
         <Card>
            <CardBody className="BDP-Header">
               <CardTitle>
                  <img src={bryItemData.sprites.default} alt={bryData.name} />
                  <h1 className="BDP-Title">{fixString(bryData.name)}</h1>
               </CardTitle>
            </CardBody>
            <CardBody className="BDP-Body">
               <p>{bryItemData.effect_entries[0].effect}</p>
               <table>
                  <tbody>
                     <tr>
                        {bryData.flavors.map((flvr) => {
                           let { name } = flvr.flavor;
                           return <td>{name}</td>;
                        })}
                     </tr>
                     <tr>
                        {bryData.flavors.map((flvr) => {
                           let { potency } = flvr;
                           return <td>{potency}</td>;
                        })}
                     </tr>
                  </tbody>
               </table>
            </CardBody>
         </Card>
      </div>
   );
};

export default BerryDetails;
