

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

require("dotenv").config();
const db = require("./db");
const PORT = process.env.PORT || 3000;

(async () => {
  const app = require("./app")
  await db();
  console.log("connected")
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
})();
