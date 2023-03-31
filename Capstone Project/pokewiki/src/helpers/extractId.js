const extractId = (url, type) => {
   let base_url = `https://pokeapi.co/api/v2/${type}/`;
   let newUrl = url;
   return newUrl.slice(base_url.length, url.length - 1);
};

export default extractId;
