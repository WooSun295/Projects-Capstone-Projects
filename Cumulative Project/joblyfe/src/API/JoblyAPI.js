import axios from "axios";

const BASE_URL = "http://localhost:3001";

class JoblyAPI {
   ///auth
   static async auth(userObj, title) {
      const res = await axios.post(`${BASE_URL}/auth/${title}`, userObj);
      return res.data;
   }

   //getAll
   static async getAll(title) {
      const res = await axios.get(`${BASE_URL}/${title}`);
      return res.data;
   }
}

export default JoblyAPI;
