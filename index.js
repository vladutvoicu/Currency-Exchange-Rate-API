const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();
const app = express();
let PORT = process.env.PORT || 3000;

async function main() {
  const uri = dotenv.parsed["MONGODB_URI"];

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const rates = await getRates(client);
    return rates;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

async function getRates(client) {
  const rates = await client
    .db("currencyexchangerates")
    .collection("rates")
    .findOne();

  return rates;
}

app.listen(PORT, () => console.log(`live on http://localhost:${PORT}`));

app.use(express.json());

app.get("/:baseCurrency/:targetCurrency", (req, res) => {
  const { baseCurrency } = req.params;
  const { targetCurrency } = req.params;

  if (!baseCurrency) {
    res.status(418).send({ message: "Base currency is required!" });
  }

  if (!targetCurrency) {
    res.status(418).send({ message: "Target currency is required!" });
  }

  if (baseCurrency != "" && targetCurrency != "") {
    var exchangeRate;
    var date;

    main()
      .then((rates) => {
        exchangeRate = rates[baseCurrency][targetCurrency];
        date = rates["DATE"];
      })
      .catch(console.error)
      .then(() =>
        res.send({
          baseCurrency: baseCurrency,
          targetCurrency: targetCurrency,
          exchangeRate: exchangeRate,
          date: date,
        })
      );
  }
});
