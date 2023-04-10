import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Form, Label, Input, Button } from "reactstrap";

import PokeWikiAPI from "../../helpers/backend";

import "./Forms.css";

const UserUpdate = ({ addToken, token }) => {
   const INITIAL_STATE = {
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      pfpUrl: "",
   };
   const [formData, setFormData] = useState(INITIAL_STATE);
   const history = useHistory();
   const { username } = useParams();

   const userToken = token._token ? token._token : JSON.parse(token)._token;

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      let newToken =
         username && userToken
            ? await PokeWikiAPI.userPost(formData, userToken)
            : await PokeWikiAPI.userPost(formData);
      addToken(newToken);
      history.push("/");
   };

   return (
      <div className="FormComponent">
         <Card>
            <CardBody className="FC-Header">
               <CardTitle>
                  <h3 className="FC-Title">User Update</h3>
               </CardTitle>
            </CardBody>
         </Card>

         <Card>
            <CardBody className="FC-Body">
               <Form onSubmit={handleSubmit} className="FC-Form">
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
            </CardBody>
         </Card>
      </div>
   );
};

export default UserUpdate;
