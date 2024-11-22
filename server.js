require(`dotenv`).config();
const express = require(`express`);
const router = express.Router();
const app = express();
const port = 3000; 

app.use(express.json());

app.use(`/auth`, require(`./api/auth`));
app.use(`/orders`, require(`./api/orders`));
app.use(`/products`, require(`./api/products`));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong :(");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

module.exports = router;