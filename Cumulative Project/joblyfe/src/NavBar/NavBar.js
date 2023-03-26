import React, { useState } from "react";
import "./NavBar.css";
// import { NavLink } from "react-router-dom";
import {
   Collapse,
   Navbar,
   NavLink,
   NavbarToggler,
   NavbarBrand,
   Nav,
   NavItem,
} from "reactstrap";
import JoblyLogo from "../logos/JoblyLogo.png";

const NavBar = () => {
   const [isOpen, setIsOpen] = useState(false);

   const toggle = () => setIsOpen(!isOpen);

   return (
      <div>
         <Navbar expand="true" container="fluid">
            <NavbarBrand href="/companies" className="me-auto">
               <img
                  src={JoblyLogo}
                  alt="Jobly"
                  style={{ height: 40, width: 40 }}
                  className="me-2"
               />
               Jobly
            </NavbarBrand>
            <NavbarToggler onClick={toggle} className="me-2" type="button" />
            <Collapse isOpen={isOpen} navbar>
               <Nav className="me-auto" navbar>
                  <NavItem>
                     <NavLink href="/jobs" className="navbar-jobs me-auto">
                        Jobs
                     </NavLink>
                  </NavItem>
                  <NavItem>
                     <NavLink className="navbar-auth me-auto" href="/auth/register">
                        Register/Login
                     </NavLink>
                  </NavItem>
               </Nav>
            </Collapse>
         </Navbar>
      </div>
   );
};

export default NavBar;
