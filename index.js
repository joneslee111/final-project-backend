const express = require('express');
const app = express();
const fetch = require("node-fetch");
// const pool = require("./db");
const pg = require("pg");
const R = require('ramda')
const API_KEY = "36a625081590440285cabb596440609b";
const level = 3


app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));


// app.post('/https://api.edamam.com/search')


// GET localhost:3000/fetch_recipe?from=10&to=20
app.get("/fetch_recipe", async (req, res) => {
  console.log("/fetch_recipe endpoint called");
//   const fromNumber = req.params.from
//   const toNumber = req.params.to
// const url = `https://api.spoonacular.com/recipes/1095886/analyzedInstructions&?apiKey=${API_KEY}`

const url ='https://api.spoonacular.com/recipes/${recipe_id}/analyzedInstructions/?&apiKey=36a625081590440285cabb596440609b'

// const url = `https://api.spoonacular.com/recipes/complexSearch/?instructionsRequired=true&maxReadyTime=120&&sort=time&ingredients=&sortDirection=desc&number=10&apiKey=${API_KEY}`;


  const options = {
    "method": "GET"
  };
  const apiResponse = await fetch(url, options);
  const jsonApiResponse = await apiResponse.json();

  console.log("RESPONSE: ", jsonApiResponse);

  return res.json(jsonApiResponse);
});



// button (on client browser)
// let currentPage = 0
// let numResults = 10
// document.addEventListener("click", () => {
//     //get more function
//     fetch(`localhost:3000/fetch_recipes?from=${currentPage}&to=${currentPage + numResults}`)

//     curentPage += 10
// })

// get from database

const config = {
  database: 'final_project'
}

const pool = new pg.Pool(config);

pool.connect((err, client, done) => {
    if (err) throw err;
    client.query(`SELECT * FROM curated_recipes WHERE level = '3'`, (err, res) => {
      if (err)
        console.log(err.stack);
      else {
        console.log(res.rows);
      }
      pool.end()
    })

})


module.exports = app;
