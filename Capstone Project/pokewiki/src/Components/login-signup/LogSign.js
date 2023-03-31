import React, { useState } from "react";
import FormCom from "../FormCom/FormCom";
import { signup, login } from "../FormCom/formFields";

import "./LogSign.css";

const LogSign = ({ title, addToken }) => {
   const [currentForm, setCurrentForm] = useState(title);

   const toggleForm = (formName) => {
      setCurrentForm(formName);
   };

   return (
      <div className="Login-Signup">
         {currentForm === "login" ? (
            <FormCom
               changeForm={toggleForm}
               addToken={addToken}
               title="login"
               formFields={login}
            />
         ) : (
            <FormCom
               changeForm={toggleForm}
               addToken={addToken}
               title="signup"
               formFields={signup}
            />
         )}
      </div>
   );
};

export default LogSign;
