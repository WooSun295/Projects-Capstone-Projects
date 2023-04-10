import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";

import PokeWikiAPI from "../../../helpers/backend";
import Offpage from "../../Offpage/Offpage";

import fixString from "../../../helpers/fixStrings";

import "./ItemDetails.css";

const ItemDetails = () => {
   const { id } = useParams();
   const [itemData, setItemData] = useState();
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const getData = async () => {
         setIsLoading(true);
         let data = await PokeWikiAPI.pokeGet("item", id);
         setItemData(data.item);
         setIsLoading(false);
      };
      getData();
   }, [id]);

   if (isLoading) return <Offpage msg="Loading &hellip;" />;

   return (
      <div className="Item-Details-Page">
         <Card>
            <CardBody className="IDP-Header">
               <CardTitle>
                  <img
                     src={itemData.sprites.default}
                     alt={itemData.name}
                     className="IDP-Img"
                  />
                  <h1 className="IDP-Title">{fixString(itemData.name)}</h1>
               </CardTitle>
            </CardBody>
            <CardBody className="IDP-Body">
               <p className="IDP-Desc">{itemData.effect_entries[0].effect}</p>
            </CardBody>
         </Card>
      </div>
   );
};

export default ItemDetails;
