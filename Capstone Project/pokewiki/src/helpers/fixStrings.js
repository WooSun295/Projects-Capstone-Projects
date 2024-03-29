const fixString = (str) => {
   let newStr = str;
   for (let i = 0; i < str.length; i++) {
      if ((i === 0 || newStr[i - 1] === " ") && i + 1 < str.length) {
         newStr = newStr.slice(0, i) + newStr[i].toUpperCase() + newStr.slice(i + 1);
      } else if (newStr[i] === "-" && i + 1 < str.length) {
         newStr = newStr.slice(0, i) + " " + newStr.slice(i + 1);
      } else if (i + 1 === str.length && newStr[i - 1] === " ") {
         newStr = newStr.slice(0, i) + newStr[i].toUpperCase();
      }
   }

   return newStr;
};

export default fixString;
