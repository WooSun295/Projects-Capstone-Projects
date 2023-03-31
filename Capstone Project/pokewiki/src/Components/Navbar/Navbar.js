import React from "react";
import { NavLink } from "react-router-dom";

import smallLogo from "../../SmallLogo.png";
import decodeToken from "../../helpers/decodeToken";

import "./Navbar.css";

const Navbar = ({ userToken }) => {
   let token;
   if (userToken) {
      token = userToken._token ? userToken._token : JSON.parse(userToken)._token;
   }

   return (
      <nav className="Navbar">
         <NavLink to="/" className="Navbar-logo">
            <img src={smallLogo} alt="Logo" className="Navbar-logo-img" />
            PokeWiki
         </NavLink>
         <p>|</p>
         <NavLink to="/pokemon">Pokemon</NavLink>
         <p>|</p>
         <NavLink to="/ability">Ability</NavLink>
         <p>|</p>
         <NavLink to="/item">Item</NavLink>
         <p>|</p>
         <NavLink to="/berry">Berry</NavLink>
         <p className="last-left">|</p>
         {userToken ? (
            <NavLink to={`/user/${decodeToken(token).username}`}>
               <p className="Navbar-uname">{decodeToken(token).username}</p>
               <img src={decodeToken(token).pfpUrl} alt="pfp" className="Navbar-pfp" />
            </NavLink>
         ) : (
            <NavLink to="/login">Login/SignUp</NavLink>
         )}
      </nav>
   );
};

export default Navbar;
