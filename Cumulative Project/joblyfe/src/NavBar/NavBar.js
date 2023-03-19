import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

const NavBar = () => {
   return (
      <div>
         <Navbar expand="md">
            <NavLink exact to="/companies" className="navbar-brand">
               Jobly
            </NavLink>

            <NavLink className="navbar-auth me-auto" to="/auth/register">
               Register/Login
            </NavLink>
         </Navbar>
      </div>
   );
};

export default NavBar;
