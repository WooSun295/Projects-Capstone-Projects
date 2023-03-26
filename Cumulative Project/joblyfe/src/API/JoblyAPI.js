import axios from "axios";

const BASE_URL = "http://localhost:3001";

class JoblyAPI {
   ///auth
   static async auth(userObj, title) {
      const res = await axios.post(`${BASE_URL}/auth/${title}`, userObj);
      return res.data;
   }

   //getAll
   static async getAll(title, token) {
      const res = !token
         ? await axios.get(`${BASE_URL}/${title}`)
         : await axios.get(`${BASE_URL}/${title}`, { headers: token });
      return res.data;
   }

   //get
   static async get(title, id, token) {
      const res = !token
         ? await axios.get(`${BASE_URL}/${title}/${id}`)
         : await axios.get(`${BASE_URL}/${title}/${id}`, { headers: token });
      return res.data;
   }
}

export default JoblyAPI;
