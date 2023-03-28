import React from "react";
import { NavLink } from "react-router-dom";

import smallLogo from "../../SmallLogo.png";

import "./Navbar.css";

const Navbar = ({ user }) => {
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
         {user.username ? (
            <NavLink to={`/${user.username}`}>
               <img src={user.pfpUrl} alt="pfp" />
            </NavLink>
         ) : (
            <NavLink to="/login">Login/SignUp</NavLink>
         )}
      </nav>
   );
};

export default Navbar;
