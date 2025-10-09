const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const loginMiddleware = require("./middlewares/loginMiddleware");
const registerMiddleware = require("./middlewares/registerMiddleware");
const tokenMiddleware = require("./middlewares/tokenMiddleware");
const xssSanitizer = require('./middlewares/xssSanitizerMiddleware');
const CsrfMiddleware = require("./middlewares/csrfMiddleware");

const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const userRoutes = require("./routes/userRoutes");
const database = require("./config/database");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(xssSanitizer);

app.post("/api/login", loginMiddleware.login);
app.post("/api/register", registerMiddleware.register);

app.get("/api/csrf-token", CsrfMiddleware.generateToken, (req, res) => {
  res.json({ csrfToken: req.csrfToken });
});

app.use(CsrfMiddleware.validateToken);

app.use(tokenMiddleware.validateToken);


app.use("/api", categoryRoutes);
app.use("/api", transactionRoutes);
app.use("/api", userRoutes);


app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3001;
database.sync({ force: false })
  .then(() => {
    app.listen(Number(PORT), () =>
      console.log(`🚀 Servidor rodando na porta: ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Erro ao sincronizar o banco de dados:", error);
  });