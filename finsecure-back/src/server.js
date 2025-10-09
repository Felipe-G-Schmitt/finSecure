const express = require("express");
const cors = require("cors");
require("dotenv").config();

const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const loginMiddleware = require("./middlewares/loginMiddleware");
const registerMiddleware = require("./middlewares/registerMiddleware");
const tokenMiddleware = require("./middlewares/tokenMiddleware");

const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const userRoutes = require("./routes/userRoutes");
const database = require("./config/database");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/login", loginMiddleware.login);
app.post("/api/register", registerMiddleware.register);

app.use("/api", tokenMiddleware.validateToken, categoryRoutes);
app.use("/api", tokenMiddleware.validateToken, transactionRoutes);
app.use("/api", tokenMiddleware.validateToken, userRoutes);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3001;
database
  .sync({ force: true })
  .then(() => {
    app.listen(Number(PORT), () =>
      console.log(`🚀 Servidor rodando na porta: ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Erro ao sincronizar o banco de dados:", error);
  });
