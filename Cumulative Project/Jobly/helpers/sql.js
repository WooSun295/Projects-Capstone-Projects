const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
   const keys = Object.keys(dataToUpdate);
   if (keys.length === 0) throw new BadRequestError("No data");

   // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
   const cols = keys.map(
      (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
   );

   return {
      setCols: cols.join(", "),
      values: Object.values(dataToUpdate),
   };
}

function companyFilter(name, min, max) {
   const filter = [];
   if (name) {
      filter.push(`UPPER(name) LIKE UPPER('%${name}%')`);
   }
   if (min) {
      filter.push(`num_employees >= ${min}`);
   }
   if (max) {
      filter.push(`num_employees <= ${max}`);
   }

   return filter.join(" AND ");
}

function jobFilter(title, minS, hasE) {
   const filter = [];
   if (title) {
      filter.push(`UPPER(title) LIKE UPPER('%${title}%')`);
   }
   if (minS) {
      filter.push(`salary >= ${minS}`);
   }
   if (hasE) {
      filter.push(`equity > 0`);
   }

   return filter.join(" AND ");
}

module.exports = { sqlForPartialUpdate, companyFilter, jobFilter };
