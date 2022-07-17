const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();
const fs = require("fs");
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

app.set("json spaces", 4);

app.get("/:baseCurrency?/:targetCurrency?", (req, res) => {
  const { baseCurrency } = req.params;
  const { targetCurrency } = req.params;

  const currencies = JSON.parse(fs.readFileSync("currencies.json", "utf8"));

  if (!baseCurrency) {
    res.send({ error: "Base currency is required!" });
  }

  if (
    currencies.includes(baseCurrency) &&
    currencies.includes(targetCurrency)
  ) {
    var exchangeRates;
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
  } else if (
    currencies.includes(baseCurrency) &&
    !currencies.includes(targetCurrency) &&
    targetCurrency == undefined
  ) {
    main()
      .then((rates) => {
        exchangeRates = rates[baseCurrency];
        date = rates["DATE"];
      })
      .catch(console.error)
      .then(() =>
        res.send({
          baseCurrency: baseCurrency,
          rates: exchangeRates,
          date: date,
        })
      );
  } else if (!currencies.includes(baseCurrency)) {
    res.send({ error: `${baseCurrency} is not an available currency!` });
  } else if (!currencies.includes(targetCurrency)) {
    res.send({ error: `${targetCurrency} is not an available currency!` });
  }
});
