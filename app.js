const express = require("express");
const http = require("http");
const app = express();
const config = require("./config/app");

const productRoute = require("./route/productRoute");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(express.static(config.asset));

// route
app.use("/product", productRoute);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: false,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

const port = parseInt(process.env.PORT, 10) || 3000;
app.set("port", port);
const server = http.createServer(app);
server.listen(port, function () {
  console.log("app running on http://localhost:" + port);
});
module.exports = app;
