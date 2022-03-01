import express from 'express';
import bodyParser from 'body-parser'
import cors from "cors"
const app = express();
const PORT = 5000;
app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.listen(PORT, () =>
    console.log(`Server is running on port: http://localhost:${PORT}`)
);

import Amadeus from 'amadeus';
const amadeus = new Amadeus({
    clientId: 'Ni9mj0vngWv2GpU2HmHR8a7POR2XjGaM',
    clientSecret: 'WztRfu6jeDKjG83j',
});

app.get(`/city-and-airport-search/:parameter`, (req, res) => {
    const parameter = req.params.parameter;
    // Which cities or airports start with the parameter variable
    amadeus.referenceData.locations
        .get({
            keyword: parameter,
            subType: Amadeus.location.any,
        })
        .then(function (response) {
            res.send(response.result);
        })
        .catch(function (response) {
            res.send(response);
        });
});


app.get(`/flight-search`, (req, res) => {
  const originCode = req.query.originCode;
  const destinationCode = req.query.destinationCode;
  const dateOfDeparture = req.query.dateOfDeparture
  // Find the cheapest flights
  amadeus.shopping.flightOffersSearch.get({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: dateOfDeparture,
      adults: '1',
      max: '7'
  }).then(function (response) {
      res.send(response.result);
  }).catch(function (response) {
      res.send(response);
  });
});


  app.post(`/flight-confirmation`, (req, res) => {
    const flight = req.body.flight
    // Confirm availability and price
    amadeus.shopping.flightOffers.pricing.post(
        JSON.stringify({
            'data': {
                'type': 'flight-offers-pricing',
                'flightOffers': [flight],
            }
        })
    ).then(function (response) {
            res.send(response.result);
        }).catch(function (response) {
            res.send(response)
        })
})





