require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor activo: http://localhost:${PORT}`);
});