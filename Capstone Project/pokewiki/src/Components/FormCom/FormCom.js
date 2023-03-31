import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Form, Label, Input, Button } from "reactstrap";
import fixString from "../../helpers/fixStrings";
import PokeWikiAPI from "../../helpers/backend";

import "./FormCom.css";

const FormCom = ({ formFields, addToken, changeForm, title }) => {
   const [formData, setFormData] = useState(formFields);
   const history = useHistory();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const token = await PokeWikiAPI.userPost(formData);
      addToken(token);
      history.push("/");
   };

   return (
      <div className="FormComponent">
         <Card>
            <CardBody className="FC-Header">
               <CardTitle>
                  <h3 className="FC-Title">{title.toUpperCase()}</h3>
               </CardTitle>
            </CardBody>
         </Card>

         <Card>
            <CardBody className="FC-Body">
               <Form onSubmit={handleSubmit} className="FC-Form">
                  {Object.keys(formData).map((field) => {
                     if (field === "pfpUrl") {
                        return (
                           <div className="FC-Div" key={field}>
                              <Label htmlFor={field} className="FC-Label">
                                 Profile Img:
                              </Label>
                              <Input
                                 id={field}
                                 name={field}
                                 type="url"
                                 value={formData[field]}
                                 className="FC-Input"
                                 onChange={handleChange}
                                 required
                              />
                           </div>
                        );
                     } else if (field === "password" || field === "email") {
                        return (
                           <div className="FC-Div" key={field}>
                              <Label htmlFor={field} className="FC-Label">
                                 {fixString(field)}:
                              </Label>
                              <Input
                                 id={field}
                                 name={field}
                                 type={field}
                                 value={formData[field]}
                                 className="FC-Input"
                                 onChange={handleChange}
                                 required
                              />
                           </div>
                        );
                     } else {
                        return (
                           <div className="FC-Div" key={field}>
                              <Label htmlFor={field} className="FC-Label">
                                 {fixString(field)}:
                              </Label>
                              <Input
                                 id={field}
                                 name={field}
                                 type="text"
                                 value={formData[field]}
                                 className="FC-Input"
                                 onChange={handleChange}
                                 required
                              />
                           </div>
                        );
                     }
                  })}
                  <Button className="FC-Btn">Submit</Button>
               </Form>
               {changeForm && title === "login" ? (
                  <Link to="/signup" onClick={() => changeForm("signup")}>
                     Don't have an account? Signup
                  </Link>
               ) : (
                  <Link to="/login" onClick={() => changeForm("login")}>
                     Already have an account? Login
                  </Link>
               )}
            </CardBody>
         </Card>
      </div>
   );
};

export default FormCom;
