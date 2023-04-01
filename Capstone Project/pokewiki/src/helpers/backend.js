import axios from "axios";
import decodeToken from "./decodeToken";

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
   static async userGet(token, favs) {
      const username = decodeToken(token).username;
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
   static async userPost(formData, token, id) {
      const username = decodeToken(token).username;
      let res;
      if (formData && Object.keys(formData).length === 6) {
         res = await axios.post(`${BASE_URL}/auth/signup`, formData);
         return res.data;
      } else if (formData && Object.keys(formData).length === 2) {
         res = await axios.post(`${BASE_URL}/auth/login`, formData);
         return res.data;
      } else if (formData && token) {
         res = await axios.patch(`${BASE_URL}/users/${username}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
         });
         return res.data;
      } else if (!formData && token && id) {
         await axios.post(`${BASE_URL}/users/${username}/favs/${id}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
         });
      }
   }

   //users route / DELETE
   static async userDelete(token, id) {
      const username = decodeToken(token).username;
      id
         ? await axios.delete(`${BASE_URL}/users/${username}/favs/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
           })
         : await axios.delete(`${BASE_URL}/users/${username}`, null, {
              headers: { Authorization: `Bearer ${token}` },
           });
   }
}

export default PokeWikiAPI;
