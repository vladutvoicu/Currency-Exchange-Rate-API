# Currency Exchange Rate API

A currency exchange rate API made with Node.js and Express.js, hosted on Heroku

&nbsp;

## :hammer_and_wrench: Built using

- [JavaScript](https://www.javascript.com) - Language
- [Python](https://www.python.org) - Language
- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
- [Express.js](https://expressjs.com) - Node.js framework
- [Heroku](https://www.heroku.com) - PaaS

&nbsp;

## :star: Features
- Free to use
- Fast response
- 149 currencies
- Updated daily

&nbsp;

## :clipboard: Endpoints

### Fixed

- `` currencyexchangerateapi.herokuapp.com/currencies``

### Based on parameters

- `` currencyexchangerateapi.herokuapp.com/{baseCurrency}/{targetCurrency}``

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `baseCurrency` | `string` | **Required** base currency |
| `targetCurrency` | `string` | **Optional** target currency |

&nbsp;

### Examples

#### Get available currencies

- [https://currencyexchangerateapi.herokuapp.com/currencies](https://currencyexchangerateapi.herokuapp.com/currencies)

#### Get exchange rates of all currencies according to the base currency

- [https://currencyexchangerateapi.herokuapp.com/EUR](https://currencyexchangerateapi.herokuapp.com/EUR)

#### Get exchange rate of the target currency according to the base currency

- [https://currencyexchangerateapi.herokuapp.com/EUR/RON](https://currencyexchangerateapi.herokuapp.com/EUR/RON)

&nbsp;

## :writing_hand: Authors
- [Vlăduț Voicu](https://github.com/vladutvoicu)

## :memo: License
- This repository has an [MIT license](https://github.com/vladutvoicu/Currency-Exchange-Rate-API/blob/master/LICENSE).
