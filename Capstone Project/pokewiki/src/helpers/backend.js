import axios from "axios";

const BASE_URL = "http://localhost:5000";

class PokeWikiAPI {
   //pokewiki routes
   static async pokeGet(title, id) {
      const res = id
         ? await axios.get(`${BASE_URL}/pokewiki/${title}/${id}`)
         : await axios.get(`${BASE_URL}/pokewiki/${title}`);
      return res.data;
   }

   //users routes / GET
   static async userGet(username, token, favs) {
      const res = favs
         ? await axios.get(`${BASE_URL}/users/${username}/favs`, {
              headers: { Authorization: `Bearer ${token}` },
           })
         : await axios.get(`${BASE_URL}/users/${username}`, {
              headers: { Authorization: `Bearer ${token}` },
           });
      return res.data;
   }

   //users routes / POST
   static async userPost(formData, token) {
      let res;
      if (Object.keys(formData).length === 6) {
         res = await axios.post(`${BASE_URL}/auth/signup`, formData);
         return res.data;
      } else if (Object.keys(formData).length === 2) {
         res = await axios.post(`${BASE_URL}/auth/login`, formData);
         return res.data;
      }
   }

   //users route / DELETE
   static async userDelete(username, token) {
      await axios.delete(`${BASE_URL}/users/${username}`, {
         headers: { Authorization: `Bearer ${token}` },
      });
   }
}

export default PokeWikiAPI;
