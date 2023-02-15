const { sqlForPartialUpdate } = require("./sql");

const test_data = { firstName: "Tess", lastName: "Ting", isAdmin: false };

describe("testing sqlForPartialUpdate output", () => {
   test("Gets output of sqlForPartialUpdate function", async () => {
      const { setCols, values } = sqlForPartialUpdate(test_data, {
         firstName: "first_name",
         lastName: "last_name",
         isAdmin: "is_admin",
      });
      expect(setCols).toEqual(expect.any(String));
      expect(values).toEqual(expect.any(Array));
   });
});
