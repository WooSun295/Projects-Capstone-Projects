const pluralize = (str) => {
   let i = str.length - 1;
   let newStr = str;

   if (str[i] == "s") {
      return newStr.concat("es");
   } else if (str[i] == "y") {
      return newStr.replace("y", "ies");
   } else {
      return newStr.concat("s");
   }
};

module.exports = pluralize;
