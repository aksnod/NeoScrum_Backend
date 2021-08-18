require("dotenv").config();
const express = require("express");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const db = require("./config/mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
//const passportJWT = require("./config/passport-jwt-strategy");

const port = 8000;

//swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NeoScrum API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8000/",
      },
    ],
  },
  apis: ["./routes/index.js"],
};
const swaggerSpc = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpc));

//conver json to object
app.use(express.json());

app.use(cookieParser());
//routes the master url

app.use(express.urlencoded());
app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) console.log("Error to connect server port");
  else console.log("Successfully connect to server port " + port);
});
