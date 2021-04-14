const express = require('express');
const app = express();
const fetch = require("node-fetch")

const API_KEY = "fe316b63c7b07739c4de5380f4bc6456";
const APP_ID = "0b432fb5";

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));


// app.post('/https://api.edamam.com/search')


app.get("/fetch_recipe", async (req, res) => {
  console.log("/fetch_recipe endpoint called");
  const url = `https://api.edamam.com/search?q=chicken&app_id=0b432fb5&app_key=fe316b63c7b07739c4de5380f4bc6456`;
  const options = {
    "method": "GET"
  };
  const response = await fetch(url, options);

  console.log("RESPONSE: ", response);
  await res.json(response);
//   console.log(data);
  
});

module.exports = app;

