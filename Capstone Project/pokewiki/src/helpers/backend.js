import axios from "axios";

const BASE_URL = "http://localhost:5000";

class PokeWikiAPI {
   ///auth
   //    static async auth(userObj, title) {
   //       const res = await axios.post(`${BASE_URL}/auth/${title}`, userObj);
   //       return res.data;
   //    }

   //getAll
   static async getAll(title) {
      const res = await axios.get(`${BASE_URL}/pokewiki/${title}`);
      return res.data;
   }

   //get
   static async get(title, id, token) {
      const res = !token
         ? await axios.get(`${BASE_URL}/pokewiki/${title}/${id}`)
         : await axios.get(`${BASE_URL}/pokewiki/${title}/${id}`, { headers: token });
      return res.data;
   }

   //User
   static async user(formData, token) {
      let res;
      if (Object.keys(formData).length === 6) {
         console.log("inside");
         res = await axios.post(`${BASE_URL}/auth/signup`, formData);
         return res.data;
      }
   }
}

export default PokeWikiAPI;
