function addCommas(num) {
   const temp = num.toString().split("");
   const numRes = [];
   let count = 0;
   for (let i = temp.length - 1; i >= 0; i--) {
      if (temp[i] !== "-") count++;
      if (!temp[i - 1]) count = "done";

      if (count % 3 === 0) {
         numRes.unshift(",", temp[i]);
         count = 0;
      } else {
         numRes.unshift(temp[i]);
      }
   }

   return numRes.join("");
}

module.exports = addCommas;
