import SECRET_KEY from "../config";
import jwt from "jsonwebtoken";

const decodeToken = (token) => {
   if (token) {
      const info = jwt.verify(token, SECRET_KEY);
      return info;
   } else return false;
};

export default decodeToken;
