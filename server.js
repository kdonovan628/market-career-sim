require(`dotenv`).config();
const express = require(`express`);
const app = express();
const PORT = 3000; 

app.use(require("morgan")("dev"));
app.use(express.json());

// Route handlers 
app.use(`/auth`, require(`./api/auth`).router);
app.use(`/orders`, require(`./api/orders`));
app.use(`/products`, require(`./api/products`));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// 404 handler
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

// Error handler 
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong :(");
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});