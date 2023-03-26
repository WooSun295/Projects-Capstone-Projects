import React, { useState } from "react";
import { Link } from "react-router-dom";
import getLogo from "../logos/getLogo";
import { ListGroupItem } from "reactstrap";
import "./ListCell.css";

const ListCell = ({ data, title, color }) => {
   const [hover, setHover] = useState(false);
   let position = "right";

   if (hover) position = "left";
   else position = "right";

   if (title == "companies") {
      return (
         <Link to={`/${title}/${data.handle}`} title={title}>
            {title == "companies" &&
               (data.logoUrl ? (
                  <img className="LC-Com-Img" src={getLogo(data.logoUrl).logo} />
               ) : (
                  <img
                     className="LC-Com-Img"
                     src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
                  />
               ))}
            <ListGroupItem>{data.name}</ListGroupItem>
         </Link>
      );
   } else if (title == "jobs") {
      return (
         <Link
            to={`/${title}/${data.id}`}
            className="LC-Job"
            style={{
               background: `linear-gradient(to left, transparent 50%, ${color} 50%) ${position} center / 200%`,
               transition: "0.3s ease-out",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
         >
            <h3 className="LC-Job-Title">{data.title}</h3>
         </Link>
      );
   }
};

export default ListCell;
