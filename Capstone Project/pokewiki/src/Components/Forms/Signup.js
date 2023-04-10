import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Form, Label, Input, Button } from "reactstrap";

import PokeWikiAPI from "../../helpers/backend";

import "./Forms.css";

const Signup = ({ addToken }) => {
   const INITIAL_STATE = {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      pfpUrl: "",
   };
   const [formData, setFormData] = useState(INITIAL_STATE);
   const history = useHistory();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      let newToken = await PokeWikiAPI.userPost(formData);
      addToken(newToken);
      setFormData(INITIAL_STATE);
      history.push("/");
   };

   return (
      <div className="FormComponent">
         <Card>
            <CardBody className="FC-Header">
               <CardTitle>
                  <h3 className="FC-Title">SIGNUP</h3>
               </CardTitle>
            </CardBody>
         </Card>

         <Card>
            <CardBody className="FC-Body">
               <Form onSubmit={handleSubmit} className="FC-Form">
                  <div className="FC-Div" key="username">
                     <Label htmlFor="username" className="FC-Label">
                        Username:
                     </Label>
                     <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        className="FC-Input"
                        onChange={handleChange}
                        required
                     />
                  </div>

                  <div className="FC-Div" key="password">
                     <Label htmlFor="password" className="FC-Label">
                        Password:
                     </Label>
                     <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        className="FC-Input"
                        onChange={handleChange}
                        required
                     />
                  </div>

                  <div className="FC-Div" key="firstName">
                     <Label htmlFor="firstName" className="FC-Label">
                        First Name:
                     </Label>
                     <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        className="FC-Input"
                        onChange={handleChange}
                        required
                     />
                  </div>

                  <div className="FC-Div" key="lastName">
                     <Label htmlFor="lastName" className="FC-Label">
                        Last Name:
                     </Label>
                     <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        className="FC-Input"
                        onChange={handleChange}
                        required
                     />
                  </div>

                  <div className="FC-Div" key="email">
                     <Label htmlFor="email" className="FC-Label">
                        Email:
                     </Label>
                     <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        className="FC-Input"
                        onChange={handleChange}
                        required
                     />
                  </div>

                  <div className="FC-Div" key="pfpUrl">
                     <Label htmlFor="pfpUrl" className="FC-Label">
                        Profile Picture:
                     </Label>
                     <Input
                        id="pfpUrl"
                        name="pfpUrl"
                        type="url"
                        value={formData.pfpUrl}
                        className="FC-Input"
                        onChange={handleChange}
                        required
                     />
                  </div>

                  <Button className="FC-Btn">Submit</Button>
               </Form>

               <Link to="/login">Already have an account? Login</Link>
            </CardBody>
         </Card>
      </div>
   );
};

export default Signup;
