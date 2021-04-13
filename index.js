const express = require('express');
const app = express();
const fetch = require("node-fetch")

const API_KEY = "fe316b63c7b07739c4de5380f4bc6456";
const APP_ID = "0b432fb5"

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));


app.post('/https://api.edamam.com/search')


app.get("/fetch_recipe", async (req, res) => {
  console.log("/fetch_recipe endpoint called");
  const url = "https://api.edamam.com/search?q=chicken&app_id=${APP_ID}&app_key=${API_KEY}&from=0&to=3&calories=591-722&health=alcohol-free";
  const options = {
    "method": "GET"
  };
  const response = await fetch(url, options);

  console.log("RESPONSE: ", response);
  res.json(response);
});

module.exports = app;
